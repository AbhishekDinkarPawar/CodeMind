import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface Ingredient {
  original: string;
}

interface InstructionStep {
  step: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchText: string = '';
  searchResults: Recipe[] = [];
  loading: boolean = false;
  showResults: boolean = false;
  selectedRecipe: Recipe | null = null;
  recipeIngredients: Ingredient[] = [];
  recipeInstructions: InstructionStep[] = [];
  inputVisible: boolean = true;
  cardVisible: boolean[] = []; 

  constructor(private http: HttpClient) { }

  search() {
    if (this.searchText) {
      this.loading = true;
      this.inputVisible = false; 
      const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${this.searchText}&number=5&apiKey=94a956fa15df45089176c123ec18f608`;
      this.http.get<any>(apiUrl).subscribe(
        (data: any) => {
          console.log('API Response:', data);
          this.searchResults = data.results;
          this.loading = false;
          this.showResults = true;
          this.cardVisible = new Array(this.searchResults.length).fill(true);
        },
        (error: any) => {
          console.error('Error fetching data:', error);
          this.loading = false;
        }
      );
    }
  }

  showRecipeDetails(recipe: Recipe, index: number) {
    this.cardVisible = this.cardVisible.map((_, i) => i === index);

    this.selectedRecipe = recipe;
    this.fetchRecipeInformation(recipe.id);
  }

  closeRecipeDetails() {
    this.selectedRecipe = null;
    this.recipeIngredients = [];
    this.recipeInstructions = [];
  }

  fetchRecipeInformation(recipeId: number) {
    const recipeInfoUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=94a956fa15df45089176c123ec18f608`;
    this.http.get<any>(recipeInfoUrl).subscribe(
      (data: any) => {
        console.log('Recipe Information:', data);
        this.recipeIngredients = data.extendedIngredients;
      },
      (error: any) => {
        console.error('Error fetching recipe information:', error);
      }
    );

    const recipeInstructionsUrl = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=94a956fa15df45089176c123ec18f608`;
    this.http.get<any>(recipeInstructionsUrl).subscribe(
      (data: any) => {
        console.log('Recipe Instructions:', data);
        if (data && data.length > 0) {
          this.recipeInstructions = data[0].steps;
        }
      },
      (error: any) => {
        console.error('Error fetching recipe instructions:', error);
      }
    );
  }
}
