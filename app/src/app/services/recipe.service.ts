import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private readonly httpClient: HttpClient) { }

  getRecipes(type: string, search: string, page: number, limit: number) {
    return this.httpClient.get(`${environment.apiUrl}recipes?type=${type}&search=${search}&page=${page}&limit=${limit}`);
  }
}
