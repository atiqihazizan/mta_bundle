import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../models/address.dart';
import '../../services/address_service.dart';

class AddressFormScreen extends StatefulWidget {
  final Address? address;

  const AddressFormScreen({
    Key? key,
    this.address,
  }) : super(key: key);

  @override
  _AddressFormScreenState createState() => _AddressFormScreenState();
}

class _AddressFormScreenState extends State<AddressFormScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  late final AddressService _addressService;
  bool _isLoading = false;
  String? _errorMessage;
  
  // Nilai awal untuk peta
  late LatLng _selectedLocation;
  late GoogleMapController _mapController;
  final Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    // Set nilai awal lokasi ke MTA atau lokasi sedia ada
    _selectedLocation = widget.address != null
        ? LatLng(widget.address!.lat ?? 3.1569, widget.address!.lng ?? 101.7123)
        : const LatLng(3.1569, 101.7123); // Lokasi MTA

    if (widget.address != null) {
      // Set nilai awal form
      _formKey.currentState?.patchValue({
        'address1': widget.address!.address1,
        'address2': widget.address!.address2,
        'address3': widget.address!.address3,
      });
    }
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
    setState(() {
      _markers.add(
        Marker(
          markerId: const MarkerId('selected_location'),
          position: _selectedLocation,
          draggable: true,
          onDragEnd: (LatLng position) {
            setState(() {
              _selectedLocation = position;
            });
          },
        ),
      );
    });
  }

  Future<void> _handleSubmit() async {
    if (_formKey.currentState?.saveAndValidate() ?? false) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        final formData = _formKey.currentState!.value;
        final data = {
          ...formData,
          'lat': _selectedLocation.latitude,
          'lng': _selectedLocation.longitude,
        };

        if (widget.address != null) {
          await _addressService.updateAddress(widget.address!.id!, data);
        } else {
          await _addressService.createAddress(data);
        }

        // Kembali ke skrin sebelumnya
        Navigator.pop(context);
      } catch (e) {
        setState(() {
          _errorMessage = e.toString();
        });
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.address != null ? 'Kemaskini Alamat' : 'Tambah Alamat',
        ),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: FormBuilder(
        key: _formKey,
        child: Column(
          children: [
            // Peta
            SizedBox(
              height: 200,
              child: GoogleMap(
                onMapCreated: _onMapCreated,
                initialCameraPosition: CameraPosition(
                  target: _selectedLocation,
                  zoom: 15,
                ),
                markers: _markers,
                onTap: (LatLng position) {
                  setState(() {
                    _selectedLocation = position;
                    _markers.clear();
                    _markers.add(
                      Marker(
                        markerId: const MarkerId('selected_location'),
                        position: position,
                        draggable: true,
                        onDragEnd: (LatLng newPosition) {
                          setState(() {
                            _selectedLocation = newPosition;
                          });
                        },
                      ),
                    );
                  });
                },
              ),
            ),
            const SizedBox(height: 16),
            // Alamat 1 field
            FormBuilderTextField(
              name: 'address1',
              decoration: const InputDecoration(
                labelText: 'Alamat 1',
                border: OutlineInputBorder(),
              ),
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(
                  errorText: 'Sila masukkan alamat 1',
                ),
              ]),
            ),
            const SizedBox(height: 16),
            // Alamat 2 field
            FormBuilderTextField(
              name: 'address2',
              decoration: const InputDecoration(
                labelText: 'Alamat 2',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            // Alamat 3 field
            FormBuilderTextField(
              name: 'address3',
              decoration: const InputDecoration(
                labelText: 'Alamat 3',
                border: OutlineInputBorder(),
              ),
            ),
            if (_errorMessage != null) ...[
              const SizedBox(height: 16),
              Text(
                _errorMessage!,
                style: const TextStyle(
                  color: Colors.red,
                  fontSize: 14,
                ),
              ),
            ],
            const SizedBox(height: 24),
            // Submit button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _handleSubmit,
                child: _isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Colors.white,
                          ),
                        ),
                      )
                    : Text(
                        widget.address != null ? 'Kemaskini' : 'Tambah',
                        style: const TextStyle(fontSize: 16),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
