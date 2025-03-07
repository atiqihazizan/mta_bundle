import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import '../../models/people.dart';
import '../../models/kariah.dart';
import '../../services/people_service.dart';

class KariahFormScreen extends StatefulWidget {
  final int addressId;
  final int? peopleId;

  const KariahFormScreen({
    Key? key,
    required this.addressId,
    this.peopleId,
  }) : super(key: key);

  @override
  _KariahFormScreenState createState() => _KariahFormScreenState();
}

class _KariahFormScreenState extends State<KariahFormScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  late final PeopleService _peopleService;
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic> _references = {};
  Map<String, dynamic>? _peopleData;

  @override
  void initState() {
    super.initState();
    _loadReferences();
    if (widget.peopleId != null) {
      _loadPeopleData();
    }
  }

  Future<void> _loadReferences() async {
    try {
      final references = await _peopleService.getReferences();
      setState(() {
        _references = references;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    }
  }

  Future<void> _loadPeopleData() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final data = await _peopleService.getPeopleDetail(widget.peopleId!);
      setState(() {
        _peopleData = data;
        _isLoading = false;
      });

      // Set nilai awal form
      _formKey.currentState?.patchValue({
        'name': data['name'],
        'nokp': data['nokp'],
        'relation': data['relation'],
        'status': data['status'],
        'tanggungan': data['tanggungan'],
        'penama': data['penama'],
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
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
          'addr_id': widget.addressId,
        };

        if (widget.peopleId != null) {
          await _peopleService.updatePeople(widget.peopleId!, data);
        } else {
          await _peopleService.createPeople(data);
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
          widget.peopleId != null ? 'Kemaskini Kariah' : 'Tambah Kariah',
        ),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: widget.peopleId != null ? _loadPeopleData : null,
              child: const Text('Cuba Lagi'),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: FormBuilder(
        key: _formKey,
        child: Column(
          children: [
            // Nama field
            FormBuilderTextField(
              name: 'name',
              decoration: const InputDecoration(
                labelText: 'Nama Penuh',
                border: OutlineInputBorder(),
              ),
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(
                  errorText: 'Sila masukkan nama penuh',
                ),
              ]),
            ),
            const SizedBox(height: 16),
            // No KP field
            FormBuilderTextField(
              name: 'nokp',
              decoration: const InputDecoration(
                labelText: 'No. Kad Pengenalan',
                border: OutlineInputBorder(),
              ),
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(
                  errorText: 'Sila masukkan no. kad pengenalan',
                ),
                FormBuilderValidators.numeric(
                  errorText: 'No. kad pengenalan mestilah nombor',
                ),
                FormBuilderValidators.minLength(
                  12,
                  errorText: 'No. kad pengenalan mestilah 12 digit',
                ),
                FormBuilderValidators.maxLength(
                  12,
                  errorText: 'No. kad pengenalan mestilah 12 digit',
                ),
              ]),
            ),
            const SizedBox(height: 16),
            // Hubungan field
            if (_references['relations'] != null)
              FormBuilderDropdown(
                name: 'relation',
                decoration: const InputDecoration(
                  labelText: 'Hubungan',
                  border: OutlineInputBorder(),
                ),
                items: (_references['relations'] as List<dynamic>)
                    .map((relation) => DropdownMenuItem(
                          value: relation['value'],
                          child: Text(relation['label']),
                        ))
                    .toList(),
                validator: FormBuilderValidators.required(
                  errorText: 'Sila pilih hubungan',
                ),
              ),
            const SizedBox(height: 16),
            // Status field
            if (_references['statuses'] != null)
              FormBuilderDropdown(
                name: 'status',
                decoration: const InputDecoration(
                  labelText: 'Status',
                  border: OutlineInputBorder(),
                ),
                items: (_references['statuses'] as List<dynamic>)
                    .map((status) => DropdownMenuItem(
                          value: status['value'],
                          child: Text(status['label']),
                        ))
                    .toList(),
                validator: FormBuilderValidators.required(
                  errorText: 'Sila pilih status',
                ),
              ),
            const SizedBox(height: 16),
            // Tanggungan field
            FormBuilderTextField(
              name: 'tanggungan',
              decoration: const InputDecoration(
                labelText: 'Tanggungan',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            // Penama field
            FormBuilderTextField(
              name: 'penama',
              decoration: const InputDecoration(
                labelText: 'Penama',
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
                        widget.peopleId != null ? 'Kemaskini' : 'Tambah',
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
