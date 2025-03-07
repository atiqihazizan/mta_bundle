class Kariah {
  final int? id;
  final int? ppl_id;
  final int? addr_id;
  final String? relation;
  final String? status;
  final String? tanggungan;
  final String? penama;
  String? relationName;
  String? statusName;

  Kariah({
    this.id,
    this.ppl_id,
    this.addr_id,
    this.relation,
    this.status,
    this.tanggungan,
    this.penama,
    this.relationName,
    this.statusName,
  });

  factory Kariah.fromJson(Map<String, dynamic> json) {
    return Kariah(
      id: json['id'],
      ppl_id: json['ppl_id'],
      addr_id: json['addr_id'],
      relation: json['relation'],
      status: json['status'],
      tanggungan: json['tanggungan'],
      penama: json['penama'],
      relationName: json['relation_name'],
      statusName: json['status_name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ppl_id': ppl_id,
      'addr_id': addr_id,
      'relation': relation,
      'status': status,
      'tanggungan': tanggungan,
      'penama': penama,
    };
  }

  // Copy with method untuk kemaskini data
  Kariah copyWith({
    int? id,
    int? ppl_id,
    int? addr_id,
    String? relation,
    String? status,
    String? tanggungan,
    String? penama,
    String? relationName,
    String? statusName,
  }) {
    return Kariah(
      id: id ?? this.id,
      ppl_id: ppl_id ?? this.ppl_id,
      addr_id: addr_id ?? this.addr_id,
      relation: relation ?? this.relation,
      status: status ?? this.status,
      tanggungan: tanggungan ?? this.tanggungan,
      penama: penama ?? this.penama,
      relationName: relationName ?? this.relationName,
      statusName: statusName ?? this.statusName,
    );
  }
}
