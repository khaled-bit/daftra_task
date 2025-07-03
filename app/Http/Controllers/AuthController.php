<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone ?? '',
            'address' => $request->address ?? '',
            'isAdmin' => false,
            'ban' => false,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        if ($user->ban) {
            return response()->json([
                'message' => 'Your account has been banned'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Already logged out'
            ], 200);
        }

        $token = $user->currentAccessToken();
        
        if ($token) {
            $token->delete();
        }

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    public function redirectToGoogle(){
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(){
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::updateOrCreate([
                'email' => $googleUser->getEmail(),
            ], [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
            ]);

            Auth::login($user);
            return redirect('/');  
        } catch (\Exception $e) {
            dd($e->getMessage());  
        }
    }

    public function index(Request $request){
        $sort = $request->query('sort', 'newest'); // Default to 'newest' if no sort is provided
        $query = User::query();

        // Apply sorting based on the requested sort option
        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'a-z':
                $query->orderBy('name', 'asc');
                break;
            case 'z-a':
                $query->orderBy('name', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Retrieve the users based on the sorting logic
        $users = $query->get();

        // Send data to frontend
        return response()->json([
            'message' => 'Users retrieved successfully.',
            'users' => $users
        ]);
    }

    public function updateUser(User $user){
        $validator = Validator::make(request()->all(), [
            "name" => ["required"],
            "email" => ["required"],
            "phone" => ["nullable", "numeric"],
            "address" => ["nullable"],
            "image" => ["nullable", "image", "mimes:jpeg,png,jpg,gif,svg", "max:2048"],
        ]);

        // condition for failed validation
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->messages()
            ], 422);
        }

        // store image
        $imagePath = null;
        if (request()->hasFile('image')) {
            $image = request()->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('users', $imageName, 'public'); 
        }else {
            // Retain the old image if no new image is provided
            $imagePath = $user->image;
        }

        Log::info(request()->all()); // Log all incoming data


        $user->update([
            'name' => request('name'),
            'email' => request('email'),
            'phone' => request('phone'),
            'address' => request('address'),
            'image' => $imagePath, // Save image path if any
        ]);
        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request, $id){
        $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($id);

        if ($request->user()->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Verify current password
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        // Update password
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function ban(Request $request, $id){
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->banned = $request->banned; // Set banned to 1
        $user->save();

        return response()->json(['message' => 'User banned successfully']);
    }

    public function delete(User $user){
        $user->delete();
        return response()->json([
            'message' => 'User deleted successful!'
        ]);
    }

}
