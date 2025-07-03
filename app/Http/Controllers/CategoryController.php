<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function store(){
        // validate all the data from frontend
        $validator = Validator::make(request()->all(), [
            "category" => ["required"],
        ]);

        // condition for failed validation
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->messages()
            ], 422);
        }

        // store the rest of the data
        $category = Category::create([
            'category' => request('category'),
        ]);

        // return when the data is successfully created.
        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category,
        ]);
    }

    public function index(){
        // take data from backend database
        $categories = Category::visible()->withCount('products')->get();

        // send data to frontend
        return response()->json($categories);
    }

    public function show($id){
        $category = Category::find($id); // Find category by ID

        // Check if category exists
        if ($category) {
            return response()->json(['category' => $category]);
        } else {
            // If category doesn't found, return a 404 with a message
            return response()->json(['message' => 'Category not found.'], 404);
        }
    }

    public function update(Category $category){
        $validator = Validator::make(request()->all(), [
            "category" => ["required"],
        ]);

        // condition for failed validation
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->messages()
            ], 422);
        }

        Log::info(request()->all()); // Log all incoming data

        $category->update([
            'category' => request('category'),
        ]);
        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category
        ]);
    }

    public function updateVisibility(Request $request, $id){
        $request->validate([
            'visibility' => 'required|boolean',
        ]);

        $category = Category::findOrFail($id);
        $category->visibility = $request->visibility;
        $category->save();

        return response()->json(['success' => true]);
    }

    public function delete(Category $category){
        $category->delete();
        return response()->json([
            'message' => 'Category deleted successful!'
        ]);
    }
}
