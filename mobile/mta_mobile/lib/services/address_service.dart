import 'package:dio/dio.dart';
import 'package:shared_preferences.dart';
import '../models/address.dart';

class AddressService {
  final Dio _dio;
  final SharedPreferences _prefs;
  static const String _baseUrl = 'http://localhost:8000/api'; // Tukar kepada URL sebenar
  static const String _offlineKey = 'offline_addresses';

  AddressService(this._dio, this._prefs);

  // Dapatkan senarai alamat
  Future<List<Address>> getAddresses() async {
    try {
      // Cuba dapatkan dari server
      final response = await _dio.get('$_baseUrl/address');
      final List<dynamic> data = response.data['data'];
      final addresses = data.map((json) => Address.fromJson(json)).toList();

      // Simpan untuk offline
      await _saveOfflineAddresses(addresses);

      return addresses;
    } catch (e) {
      // Jika offline, guna data local
      if (e is DioException && e.type == DioExceptionType.connectionError) {
        return _getOfflineAddresses();
      }
      throw _handleError(e, 'Ralat mendapatkan senarai alamat');
    }
  }

  // Dapatkan maklumat alamat tertentu
  Future<Address> getAddress(int addressId) async {
    try {
      final response = await _dio.get('$_baseUrl/address/$addressId');
      return Address.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e, 'Ralat mendapatkan maklumat alamat');
    }
  }

  // Tambah alamat baru
  Future<Address> createAddress(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('$_baseUrl/address', data: data);
      return Address.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e, 'Ralat menambah alamat');
    }
  }

  // Kemaskini alamat
  Future<Address> updateAddress(int addressId, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('$_baseUrl/address/$addressId', data: data);
      return Address.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e, 'Ralat mengemaskini alamat');
    }
  }

  // Padam alamat
  Future<void> deleteAddress(int addressId) async {
    try {
      await _dio.delete('$_baseUrl/address/$addressId');
    } catch (e) {
      throw _handleError(e, 'Ralat memadam alamat');
    }
  }

  // Simpan alamat untuk offline
  Future<void> _saveOfflineAddresses(List<Address> addresses) async {
    final addressesJson = addresses.map((a) => a.toJson()).toList();
    await _prefs.setString(_offlineKey, addressesJson.toString());
  }

  // Dapatkan alamat dari storage
  List<Address> _getOfflineAddresses() {
    final String? addressesStr = _prefs.getString(_offlineKey);
    if (addressesStr != null) {
      try {
        final List<dynamic> addressesJson = const JsonDecoder().convert(addressesStr);
        return addressesJson.map((json) => Address.fromJson(json)).toList();
      } catch (e) {
        print('Ralat mendapatkan data offline: $e');
      }
    }
    return [];
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
