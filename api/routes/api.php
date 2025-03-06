<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TabungController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\JenazahController;
use App\Http\Controllers\KariahController;
use App\Http\Controllers\LettersController;
use App\Http\Controllers\PeoplesController;
use App\Http\Controllers\VoucherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/me', [AuthController::class, 'me']);
  Route::apiResource('address', AddressController::class);
  Route::apiResource('kariah', KariahController::class);
  Route::apiResource('letter', LettersController::class);
  Route::apiResource('kutipan', TabungController::class);
  Route::apiResource('voucher', VoucherController::class);
  Route::get('/peoples/{people}/detail', [PeoplesController::class, 'getDetailWithReferences']);
  Route::apiResource('peoples', PeoplesController::class);
  Route::get('/allpeople', [PeoplesController::class,'getAll']);
  Route::get('/newpeople', [PeoplesController::class,'create']);
  Route::get('/vpeople', [VoucherController::class,'listPeople']);
  Route::get('/nvchr', [TabungController::class,'nvchr']);
  Route::apiResource('jenazah', JenazahController::class);
  Route::get('/jenazah/report/{yrmth}',[JenazahController::class,'report']);
  Route::get('/options',[AddressController::class,'options']);
  Route::get('/dashboard/stats',[AddressController::class,'dashboardStats']); // Endpoint baru
});
Route::get('/kariah/people/{kariah}',[KariahController::class,'people']);

Route::group(['prefix'=>'mobile'],function(){
  // Route::apiResource('/people',KariahController::class);
  Route::get('/kariah',[KariahController::class,'residents']);
  Route::get('/kariah/{kariah}',[KariahController::class,'show']);

  Route::apiResource('/tabung', TabungController::class);
  Route::get('/tabung',[TabungController::class,'funds']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
// Route::get('/survey/get-by-slug/{survey:slug}', [SurveyController::class, 'getBySlug']);