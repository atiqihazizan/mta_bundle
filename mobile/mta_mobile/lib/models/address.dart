class Address {
  final int? id;
  final String? address1;
  final String? address2;
  final String? address3;
  final double? lat;
  final double? lng;
  final List<dynamic>? peoples;

  Address({
    this.id,
    this.address1,
    this.address2,
    this.address3,
    this.lat,
    this.lng,
    this.peoples,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      id: json['id'],
      address1: json['address1'],
      address2: json['address2'],
      address3: json['address3'],
      lat: json['lat']?.toDouble(),
      lng: json['lng']?.toDouble(),
      peoples: json['peoples'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'address1': address1,
      'address2': address2,
      'address3': address3,
      'lat': lat,
      'lng': lng,
    };
  }

  // Copy with method untuk kemaskini data
  Address copyWith({
    int? id,
    String? address1,
    String? address2,
    String? address3,
    double? lat,
    double? lng,
    List<dynamic>? peoples,
  }) {
    return Address(
      id: id ?? this.id,
      address1: address1 ?? this.address1,
      address2: address2 ?? this.address2,
      address3: address3 ?? this.address3,
      lat: lat ?? this.lat,
      lng: lng ?? this.lng,
      peoples: peoples ?? this.peoples,
    );
  }

  // Dapatkan alamat penuh
  String get fullAddress {
    return [address1, address2, address3]
        .where((part) => part != null && part.isNotEmpty)
        .join(', ');
  }
}
