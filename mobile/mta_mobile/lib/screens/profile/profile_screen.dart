import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import '../../models/user.dart';
import '../../services/auth_service.dart';

class ProfileScreen extends StatefulWidget {
  final AuthService _authService;

  const ProfileScreen({
    Key? key,
    required AuthService authService,
  })  : _authService = authService,
        super(key: key);

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  bool _isLoading = false;
  String? _errorMessage;
  User? _user;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final user = await widget._authService.getCurrentUser();
      setState(() {
        _user = user;
        _isLoading = false;
      });

      // Set nilai awal form
      _formKey.currentState?.patchValue({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
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
        await widget._authService.updateProfile(formData);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profil berjaya dikemaskini'),
            backgroundColor: Colors.green,
          ),
        );

        // Refresh profil
        _loadUserProfile();
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
        title: const Text('Profil Saya'),
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
              onPressed: _loadUserProfile,
              child: const Text('Cuba Lagi'),
            ),
          ],
        ),
      );
    }

    if (_user == null) {
      return const Center(
        child: Text('Tiada maklumat profil'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Avatar
          CircleAvatar(
            radius: 50,
            backgroundColor: Theme.of(context).primaryColor,
            child: Text(
              _user!.name[0].toUpperCase(),
              style: const TextStyle(
                fontSize: 36,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Form
          FormBuilder(
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
                // Email field
                FormBuilderTextField(
                  name: 'email',
                  decoration: const InputDecoration(
                    labelText: 'Emel',
                    border: OutlineInputBorder(),
                  ),
                  enabled: false, // Email tidak boleh ditukar
                ),
                const SizedBox(height: 16),
                // No telefon field
                FormBuilderTextField(
                  name: 'phone',
                  decoration: const InputDecoration(
                    labelText: 'No. Telefon',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.phone,
                  validator: FormBuilderValidators.compose([
                    FormBuilderValidators.required(
                      errorText: 'Sila masukkan no. telefon',
                    ),
                  ]),
                ),
                const SizedBox(height: 16),
                // Password field
                FormBuilderTextField(
                  name: 'password',
                  decoration: const InputDecoration(
                    labelText: 'Kata Laluan Baru (Kosongkan jika tiada perubahan)',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
                  validator: FormBuilderValidators.compose([
                    FormBuilderValidators.minLength(
                      6,
                      errorText: 'Kata laluan mestilah sekurang-kurangnya 6 aksara',
                    ),
                  ]),
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
                        : const Text(
                            'Kemaskini',
                            style: TextStyle(fontSize: 16),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
