import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../models/address.dart';

class AddressMapScreen extends StatefulWidget {
  final Address address;

  const AddressMapScreen({
    Key? key,
    required this.address,
  }) : super(key: key);

  @override
  _AddressMapScreenState createState() => _AddressMapScreenState();
}

class _AddressMapScreenState extends State<AddressMapScreen> {
  late GoogleMapController _mapController;
  final Set<Marker> _markers = {};

  @override
  Widget build(BuildContext context) {
    // Dapatkan lokasi dari alamat
    final LatLng location = LatLng(
      widget.address.lat ?? 3.1569, // Default ke lokasi MTA
      widget.address.lng ?? 101.7123,
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Lokasi Alamat'),
      ),
      body: Column(
        children: [
          // Paparan alamat penuh
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Alamat:',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  widget.address.fullAddress,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 8),
                Text(
                  'Jumlah Kariah: ${widget.address.peoples?.length ?? 0}',
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
          ),
          // Peta
          Expanded(
            child: GoogleMap(
              onMapCreated: (GoogleMapController controller) {
                _mapController = controller;
                setState(() {
                  _markers.add(
                    Marker(
                      markerId: const MarkerId('address_location'),
                      position: location,
                      infoWindow: InfoWindow(
                        title: widget.address.address1,
                        snippet: 'Jumlah Kariah: ${widget.address.peoples?.length ?? 0}',
                      ),
                    ),
                  );
                });
              },
              initialCameraPosition: CameraPosition(
                target: location,
                zoom: 15,
              ),
              markers: _markers,
            ),
          ),
        ],
      ),
      // Floating button untuk tunjuk arah
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Buka Google Maps untuk tunjuk arah
          final url = 'https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}';
          // Buka URL menggunakan url_launcher package
          // TODO: Tambah url_launcher package dan implementasi
        },
        label: const Text('Tunjuk Arah'),
        icon: const Icon(Icons.directions),
      ),
    );
  }
}
