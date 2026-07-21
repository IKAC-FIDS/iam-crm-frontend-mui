import axiosInstance from '@/lib/axios';
import type { AdvancedReportFilters, PeriodComparisonFilters } from '../types/report.types';
import { comparisonParams, endpointFilterKeys, overviewKeys, serializeReportParams, type ReportParamKey } from './reportParams';
export type ExportFormat='csv'|'xlsx'; export type ReportExportKey='period-comparison'|'data-quality'|'opportunity-aging'|'opportunity-forecast'|'meeting-performance'|'task-performance'|'financial-collections'|'product-performance'|'exchange-rate-impact'|'pipeline-summary';
const exportFilterKeys: Record<Exclude<ReportExportKey, 'period-comparison'>, readonly ReportParamKey[]> = {
  'pipeline-summary': overviewKeys,
  'opportunity-forecast': endpointFilterKeys.forecast,
  'opportunity-aging': endpointFilterKeys.aging.filter((key) => key !== 'page' && key !== 'limit'),
  'meeting-performance': endpointFilterKeys.meetings,
  'task-performance': endpointFilterKeys.tasks,
  'financial-collections': endpointFilterKeys.financial,
  'product-performance': endpointFilterKeys.products,
  'exchange-rate-impact': endpointFilterKeys.exchange.filter((key) => key !== 'page' && key !== 'limit'),
  'data-quality': endpointFilterKeys.dataQuality,
};
function reportParams(key:ReportExportKey,filters:object){
  if(key==='period-comparison')return serializeReportParams(comparisonParams(filters as PeriodComparisonFilters),endpointFilterKeys.comparison);
  return serializeReportParams(filters as AdvancedReportFilters,exportFilterKeys[key]);
}
function name(header:string|undefined,fallback:string){const utf=header?.match(/filename\*=UTF-8''([^;]+)/i)?.[1],plain=header?.match(/filename="?([^";]+)"?/i)?.[1],decoded=utf?decodeURIComponent(utf):plain;return decoded?.replace(/[\\/:*?"<>|\r\n]/g,'_')||fallback;}
async function download(url:string,params:object,fallback:string){try{const response=await axiosInstance.get<Blob>(url,{params,responseType:'blob'}),blob=response.data;if(blob.type.includes('json'))throw JSON.parse(await blob.text());const href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download=name(response.headers['content-disposition'],fallback);document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(href);}catch(error){const data=(error as {response?:{data?:unknown}}).response?.data;if(data instanceof Blob)throw JSON.parse(await data.text());throw error;}}
export const exportDownloadService={report:(key:ReportExportKey,format:ExportFormat,filters:object)=>download(`/reports/exports/${key}`,{...reportParams(key,filters),format},`${key}-${new Date().toISOString().slice(0,10)}.${format}`),audit:(format:ExportFormat,filters:object,includePayload=false)=>download('/admin/audit-logs/export',{...filters,format,includePayload},`audit-logs-${new Date().toISOString().slice(0,10)}.${format}`)};
