<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;

Route::get('/produtos', [ProductController::class, 'index'])->name('api.produtos.index');
// ROTAS ESPECÍFICAS PRIMEIRO:
Route::get('/produtos/search', [ProductController::class, 'search'])->name('api.produtos.search');
Route::get('/produtos/categorias', [ProductController::class, 'categories'])->name('api.produtos.categories');  // Remover rota duplicada
Route::get('/produtos/categorias/{category}', [ProductController::class, 'productsByCategory'])->name('api.produtos.showByCategory'); //Remover

// ROTAS COM PARÂMETRO POR ÚLTIMO:
Route::get('/produtos/{id}', [ProductController::class, 'show']);
Route::post('/produtos', [ProductController::class, 'store']);
Route::put('/produtos/{id}', [ProductController::class, 'update']);
Route::delete('/produtos/{id}', [ProductController::class, 'destroy']);