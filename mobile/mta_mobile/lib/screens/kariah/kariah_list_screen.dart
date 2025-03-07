import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import '../../models/people.dart';
import '../../models/kariah.dart';
import '../../services/people_service.dart';

class KariahListScreen extends StatefulWidget {
  final int addressId;

  const KariahListScreen({
    Key? key,
    required this.addressId,
  }) : super(key: key);

  @override
  _KariahListScreenState createState() => _KariahListScreenState();
}

class _KariahListScreenState extends State<KariahListScreen> {
  late final PeopleService _peopleService;
  List<Map<String, dynamic>> _peoples = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadPeoples();
  }

  Future<void> _loadPeoples() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final peoples = await _peopleService.getPeoplesByAddress(widget.addressId);
      setState(() {
        _peoples = peoples;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _deletePeople(int peopleId, {bool fromAddressOnly = false}) async {
    try {
      await _peopleService.deletePeople(
        peopleId,
        fromAddressOnly: fromAddressOnly,
      );
      // Refresh senarai
      _loadPeoples();
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            fromAddressOnly 
                ? 'Kariah telah dikeluarkan dari alamat ini'
                : 'Kariah telah dipadam',
          ),
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
        title: const Text('Senarai Kariah'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Navigate ke skrin tambah kariah
              Navigator.pushNamed(
                context,
                '/kariah/add',
                arguments: widget.addressId,
              ).then((_) => _loadPeoples());
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
              onPressed: _loadPeoples,
              child: const Text('Cuba Lagi'),
            ),
          ],
        ),
      );
    }

    if (_peoples.isEmpty) {
      return const Center(
        child: Text(
          'Tiada kariah berdaftar untuk alamat ini',
          style: TextStyle(fontSize: 16),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadPeoples,
      child: ListView.builder(
        itemCount: _peoples.length,
        itemBuilder: (context, index) {
          final people = _peoples[index];
          return Slidable(
            endActionPane: ActionPane(
              motion: const ScrollMotion(),
              children: [
                // Keluarkan dari alamat
                SlidableAction(
                  onPressed: (_) => _showDeleteConfirmation(
                    people['id'],
                    fromAddressOnly: true,
                  ),
                  backgroundColor: Colors.orange,
                  foregroundColor: Colors.white,
                  icon: Icons.remove_circle,
                  label: 'Keluarkan',
                ),
                // Padam kekal
                SlidableAction(
                  onPressed: (_) => _showDeleteConfirmation(
                    people['id'],
                    fromAddressOnly: false,
                  ),
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  icon: Icons.delete,
                  label: 'Padam',
                ),
              ],
            ),
            child: ListTile(
              title: Text(people['name'] ?? ''),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('No. K/P: ${people['nokp'] ?? ''}'),
                  Text('Status: ${people['status_name'] ?? ''}'),
                ],
              ),
              onTap: () {
                // Navigate ke skrin edit kariah
                Navigator.pushNamed(
                  context,
                  '/kariah/edit',
                  arguments: {
                    'peopleId': people['id'],
                    'addressId': widget.addressId,
                  },
                ).then((_) => _loadPeoples());
              },
            ),
          );
        },
      ),
    );
  }

  Future<void> _showDeleteConfirmation(
    int peopleId, {
    required bool fromAddressOnly,
  }) async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          fromAddressOnly
              ? 'Keluarkan dari Alamat'
              : 'Padam Kariah',
        ),
        content: Text(
          fromAddressOnly
              ? 'Adakah anda pasti untuk mengeluarkan kariah ini dari alamat ini?'
              : 'Adakah anda pasti untuk memadam kariah ini secara kekal?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _deletePeople(peopleId, fromAddressOnly: fromAddressOnly);
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
