<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Taller;
use Illuminate\Http\Request;

class TallerApiController extends Controller
{
    public function index()
    {
        return response()->json(Taller::all());
    }
}
