import {inject} from 'aurelia-framework';
import url from 'url';

@inject(url)
export class UrlFactory {

  constructor(url) {

    this.url = url;
  }

  build(pathname, search) {
    
    let urlObj = {};

    urlObj.pathname = pathname;
    urlObj.search = search;

    return url.format(urlObj);
  }

  buildUrl(host, pathname, search) {
    
    let urlObj = this.url.parse(host);

    urlObj.pathname = pathname;
    urlObj.search = search;

    return url.format(urlObj);
  }

  buildSearchUrl(host, search) {
    
    let urlObj = this.url.parse(host);

    urlObj.search = search;

    return url.format(urlObj);
  }
}
