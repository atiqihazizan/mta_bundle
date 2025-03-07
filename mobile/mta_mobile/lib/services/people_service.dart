import 'package:dio/dio.dart';
import 'package:shared_preferences.dart';
import '../models/people.dart';
import '../models/kariah.dart';

class PeopleService {
  final Dio _dio;
  final SharedPreferences _prefs;
  static const String _baseUrl = 'http://localhost:8000/api'; // Tukar kepada URL sebenar

  PeopleService(this._dio, this._prefs);

  // Dapatkan senarai kariah untuk alamat tertentu
  Future<List<Map<String, dynamic>>> getPeoplesByAddress(int addrId) async {
    try {
      final response = await _dio.get('$_baseUrl/address/$addrId/peoples');
      return List<Map<String, dynamic>>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e, 'Ralat mendapatkan senarai kariah');
    }
  }

  // Dapatkan maklumat people dengan references
  Future<Map<String, dynamic>> getPeopleDetail(int peopleId) async {
    try {
      final response = await _dio.get('$_baseUrl/peoples/$peopleId/detail');
      return Map<String, dynamic>.from(response.data);
    } catch (e) {
      throw _handleError(e, 'Ralat mendapatkan maklumat kariah');
    }
  }

  // Tambah people baru
  Future<Map<String, dynamic>> createPeople(Map<String, dynamic> data) async {
    try {
      // Semak duplicate no KP
      final nokp = data['nokp'];
      final checkResponse = await _dio.get('$_baseUrl/peoples/check-nokp/$nokp');
      if (checkResponse.data['exists']) {
        throw Exception('No. K/P $nokp telah wujud dalam sistem');
      }

      final response = await _dio.post('$_baseUrl/peoples', data: data);
      return Map<String, dynamic>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e, 'Ralat menambah kariah');
    }
  }

  // Kemaskini people
  Future<Map<String, dynamic>> updatePeople(int peopleId, Map<String, dynamic> data) async {
    try {
      // Semak duplicate no KP (kecuali diri sendiri)
      final nokp = data['nokp'];
      final checkResponse = await _dio.get(
        '$_baseUrl/peoples/check-nokp/$nokp',
        queryParameters: {'exclude_id': peopleId},
      );
      if (checkResponse.data['exists']) {
        throw Exception('No. K/P $nokp telah wujud dalam sistem');
      }

      final response = await _dio.put('$_baseUrl/peoples/$peopleId', data: data);
      return Map<String, dynamic>.from(response.data['data']);
    } catch (e) {
      throw _handleError(e, 'Ralat mengemaskini kariah');
    }
  }

  // Padam people/kariah
  Future<void> deletePeople(int peopleId, {bool fromAddressOnly = false}) async {
    try {
      await _dio.delete(
        '$_baseUrl/peoples/$peopleId',
        queryParameters: {
          'deleteType': fromAddressOnly ? 'address' : 'permanent'
        },
      );
    } catch (e) {
      throw _handleError(e, 'Ralat memadam kariah');
    }
  }

  // Dapatkan senarai rujukan (reference data)
  Future<Map<String, dynamic>> getReferences() async {
    try {
      final response = await _dio.get('$_baseUrl/peoples/references');
      return Map<String, dynamic>.from(response.data);
    } catch (e) {
      throw _handleError(e, 'Ralat mendapatkan data rujukan');
    }
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

  // Simpan data offline
  Future<void> saveOfflineData(String key, dynamic data) async {
    await _prefs.setString(key, data.toString());
  }

  // Dapatkan data offline
  dynamic getOfflineData(String key) {
    return _prefs.getString(key);
  }
}
