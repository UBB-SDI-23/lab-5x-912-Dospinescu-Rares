import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  findPageNeighbours(currentPage: number, span: number) {
    const result: number[] = [];

    for (let i = currentPage - span; i <= currentPage + span; i++) {
      result.push(i + 1);
    }

    return result;
  }

  generatePageArray(pageTotal: number, currentPage: number, span: number = 5) {
    const pageArray: (number | string)[] = this.findPageNeighbours(-1, span).concat(this.findPageNeighbours(currentPage, span), this.findPageNeighbours(pageTotal + 1, span)).filter(num => num >= 1 && num <= pageTotal + 1);

    for (let i = 0; i < pageArray.length - 1; i++) {
      const currentNum = pageArray[i] as number;
      const nextNum = pageArray[i + 1] as number;

      if (nextNum <= currentNum) {
        pageArray.splice(i + 1, 1);
        i--;
      } else if (nextNum >= currentNum + 2) {
        pageArray.splice(i + 1, 0, "...");
        i++;
      }
    }

    return pageArray;
  }
}
