import type { Proxy } from '../../types/proxy';

export function splitProxy(proxyString: string): Proxy {
  const splitedProxy = proxyString.split(':');
  return {
    ip: splitedProxy[0],
    port: Number(splitedProxy[1]),
    socksType: 5,
    password: splitedProxy[2],
    username: splitedProxy[3],
  };
}
