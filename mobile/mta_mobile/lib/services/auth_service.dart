import 'package:dio/dio.dart';
import 'package:shared_preferences.dart';
import '../models/user.dart';

class AuthService {
  final Dio _dio = Dio();
  final SharedPreferences _prefs;
  static const String _baseUrl = 'http://localhost:8000/api'; // Tukar kepada URL sebenar
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  AuthService(this._prefs) {
    // Setup interceptor untuk token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = _prefs.getString(_tokenKey);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Token expired atau tidak sah
          logout();
        }
        return handler.next(error);
      },
    ));
  }

  // Login
  Future<User> login(String email, String password) async {
    try {
      final response = await _dio.post(
        '$_baseUrl/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      final user = User.fromJson(response.data['user']);
      user.token = response.data['token'];

      // Simpan token dan data user
      await _prefs.setString(_tokenKey, user.token!);
      await _prefs.setString(_userKey, user.toJson().toString());

      return user;
    } catch (e) {
      throw _handleError(e, 'Ralat semasa log masuk');
    }
  }

  // Register
  Future<User> register(String name, String email, String password) async {
    try {
      final response = await _dio.post(
        '$_baseUrl/register',
        data: {
          'name': name,
          'email': email,
          'password': password,
        },
      );

      final user = User.fromJson(response.data['user']);
      user.token = response.data['token'];

      // Simpan token dan data user
      await _prefs.setString(_tokenKey, user.token!);
      await _prefs.setString(_userKey, user.toJson().toString());

      return user;
    } catch (e) {
      throw _handleError(e, 'Ralat semasa pendaftaran');
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      await _dio.post('$_baseUrl/logout');
    } catch (e) {
      print('Ralat semasa log keluar: $e');
    } finally {
      // Padam token dan data user dari local storage
      await _prefs.remove(_tokenKey);
      await _prefs.remove(_userKey);
    }
  }

  // Check login status
  bool isLoggedIn() {
    return _prefs.getString(_tokenKey) != null;
  }

  // Get current user
  User? getCurrentUser() {
    final userStr = _prefs.getString(_userKey);
    if (userStr != null) {
      try {
        return User.fromJson(Map<String, dynamic>.from(
          // Parse string to Map
          const JsonDecoder().convert(userStr),
        ));
      } catch (e) {
        print('Ralat mendapatkan data user: $e');
        return null;
      }
    }
    return null;
  }

  // Handle error
  Exception _handleError(dynamic e, String defaultMessage) {
    if (e is DioException) {
      final response = e.response;
      if (response != null) {
        final data = response.data;
        if (data != null && data['message'] != null) {
          return Exception(data['message']);
        }
      }
    }
    return Exception(defaultMessage);
  }
}
