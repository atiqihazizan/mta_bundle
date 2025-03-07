import 'package:flutter/material.dart';
import '../../services/people_service.dart';
import '../../services/address_service.dart';

class StatisticsScreen extends StatefulWidget {
  final PeopleService _peopleService;
  final AddressService _addressService;

  const StatisticsScreen({
    Key? key,
    required PeopleService peopleService,
    required AddressService addressService,
  })  : _peopleService = peopleService,
        _addressService = addressService,
        super(key: key);

  @override
  _StatisticsScreenState createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  bool _isLoading = true;
  String? _errorMessage;
  Map<String, dynamic> _statistics = {};

  @override
  void initState() {
    super.initState();
    _loadStatistics();
  }

  Future<void> _loadStatistics() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      // Dapatkan senarai alamat
      final addresses = await widget._addressService.getAddresses();
      
      // Kira statistik
      int totalAddresses = addresses.length;
      int totalPeoples = 0;
      Map<String, int> statusCounts = {};
      Map<String, int> relationCounts = {};

      for (final address in addresses) {
        if (address.peoples != null) {
          totalPeoples += address.peoples!.length;
          
          for (final people in address.peoples!) {
            // Kira mengikut status
            final status = people['status_name'] ?? 'Tidak Diketahui';
            statusCounts[status] = (statusCounts[status] ?? 0) + 1;

            // Kira mengikut hubungan
            final relation = people['relation_name'] ?? 'Tidak Diketahui';
            relationCounts[relation] = (relationCounts[relation] ?? 0) + 1;
          }
        }
      }

      setState(() {
        _statistics = {
          'totalAddresses': totalAddresses,
          'totalPeoples': totalPeoples,
          'statusCounts': statusCounts,
          'relationCounts': relationCounts,
        };
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Statistik'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadStatistics,
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
              onPressed: _loadStatistics,
              child: const Text('Cuba Lagi'),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Ringkasan
          _buildSummaryCard(),
          const SizedBox(height: 16),
          // Status
          _buildStatusCard(),
          const SizedBox(height: 16),
          // Hubungan
          _buildRelationCard(),
        ],
      ),
    );
  }

  Widget _buildSummaryCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Ringkasan',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildSummaryItem(
                    icon: Icons.location_on,
                    title: 'Jumlah Alamat',
                    value: _statistics['totalAddresses'].toString(),
                  ),
                ),
                Expanded(
                  child: _buildSummaryItem(
                    icon: Icons.people,
                    title: 'Jumlah Kariah',
                    value: _statistics['totalPeoples'].toString(),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard() {
    final statusCounts = _statistics['statusCounts'] as Map<String, int>;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Mengikut Status',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ...statusCounts.entries.map((entry) => Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(entry.key),
                  Text(
                    entry.value.toString(),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildRelationCard() {
    final relationCounts = _statistics['relationCounts'] as Map<String, int>;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Mengikut Hubungan',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ...relationCounts.entries.map((entry) => Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(entry.key),
                  Text(
                    entry.value.toString(),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryItem({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Column(
      children: [
        Icon(
          icon,
          size: 32,
          color: Theme.of(context).primaryColor,
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: TextStyle(
            color: Colors.grey[600],
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
