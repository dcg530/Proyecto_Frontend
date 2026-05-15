import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = environment.production ? LogLevel.INFO : LogLevel.DEBUG;

  debug(context: string, message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`🔍 [${context}] ${message}`, data || '');
    }
  }

  info(context: string, message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`ℹ️ [${context}] ${message}`, data || '');
    }
  }

  warn(context: string, message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`⚠️ [${context}] ${message}`, data || '');
    }
  }

  error(context: string, message: string, error?: any): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`❌ [${context}] ${message}`, error || '');
    }
  }

  httpRequest(context: string, method: string, url: string, data?: any): void {
    this.debug(context, `📡 ${method} ${url}`, data);
  }

  httpResponse(context: string, method: string, url: string, data?: any): void {
    this.debug(context, `✅ ${method} ${url} - Respuesta recibida`, data);
  }

  httpError(context: string, method: string, url: string, error: any): void {
    this.error(context, `❌ ${method} ${url} - Error: ${error.status} ${error.message}`, error);
  }
}