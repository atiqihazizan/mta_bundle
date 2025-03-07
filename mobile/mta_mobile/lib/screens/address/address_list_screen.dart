import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import '../../models/address.dart';
import '../../services/address_service.dart';

class AddressListScreen extends StatefulWidget {
  const AddressListScreen({Key? key}) : super(key: key);

  @override
  _AddressListScreenState createState() => _AddressListScreenState();
}

class _AddressListScreenState extends State<AddressListScreen> {
  late final AddressService _addressService;
  List<Address> _addresses = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadAddresses();
  }

  Future<void> _loadAddresses() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final addresses = await _addressService.getAddresses();
      setState(() {
        _addresses = addresses;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteAddress(int addressId) async {
    try {
      await _addressService.deleteAddress(addressId);
      // Refresh senarai
      _loadAddresses();
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Alamat telah dipadam'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Senarai Alamat'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Navigate ke skrin tambah alamat
              Navigator.pushNamed(
                context,
                '/address/add',
              ).then((_) => _loadAddresses());
            },
          ),
        ],
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
              onPressed: _loadAddresses,
              child: const Text('Cuba Lagi'),
            ),
          ],
        ),
      );
    }

    if (_addresses.isEmpty) {
      return const Center(
        child: Text(
          'Tiada alamat berdaftar',
          style: TextStyle(fontSize: 16),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadAddresses,
      child: ListView.builder(
        itemCount: _addresses.length,
        itemBuilder: (context, index) {
          final address = _addresses[index];
          return Slidable(
            endActionPane: ActionPane(
              motion: const ScrollMotion(),
              children: [
                // Padam alamat
                SlidableAction(
                  onPressed: (_) => _showDeleteConfirmation(address.id!),
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  icon: Icons.delete,
                  label: 'Padam',
                ),
              ],
            ),
            child: ListTile(
              title: Text(address.fullAddress),
              subtitle: Text(
                'Jumlah Kariah: ${address.peoples?.length ?? 0}',
              ),
              trailing: IconButton(
                icon: const Icon(Icons.map),
                onPressed: () {
                  // Navigate ke skrin peta
                  Navigator.pushNamed(
                    context,
                    '/address/map',
                    arguments: address,
                  );
                },
              ),
              onTap: () {
                // Navigate ke skrin senarai kariah
                Navigator.pushNamed(
                  context,
                  '/kariah',
                  arguments: address.id,
                ).then((_) => _loadAddresses());
              },
            ),
          );
        },
      ),
    );
  }

  Future<void> _showDeleteConfirmation(int addressId) async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Padam Alamat'),
        content: const Text(
          'Adakah anda pasti untuk memadam alamat ini? '
          'Semua kariah yang berdaftar di alamat ini akan dikeluarkan.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _deleteAddress(addressId);
            },
            child: const Text(
              'Padam',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}
