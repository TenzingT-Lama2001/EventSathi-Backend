export interface ILoggerConfig {
  level: string;
  filename: string;
  transports: 'FILE' | 'CONSOLE' | ['FILE' | 'CONSOLE'];
  prettyPrint: boolean;
}
