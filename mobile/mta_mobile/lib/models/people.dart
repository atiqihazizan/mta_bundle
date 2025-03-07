class People {
  final int? id;
  final String nokp;
  final String name;
  final String? mobile;
  final int? stshealthy;
  final int? selfstatus;
  final int? edustatus;
  final int? employee;
  final int? sibling;
  String? healthyName;
  String? selfstatusName;
  String? edustatusName;
  String? employeeName;
  String? siblingName;

  People({
    this.id,
    required this.nokp,
    required this.name,
    this.mobile,
    this.stshealthy,
    this.selfstatus,
    this.edustatus,
    this.employee,
    this.sibling,
    this.healthyName,
    this.selfstatusName,
    this.edustatusName,
    this.employeeName,
    this.siblingName,
  });

  factory People.fromJson(Map<String, dynamic> json) {
    return People(
      id: json['id'],
      nokp: json['nokp'],
      name: json['name'],
      mobile: json['mobile'],
      stshealthy: json['stshealthy'],
      selfstatus: json['selfstatus'],
      edustatus: json['edustatus'],
      employee: json['employee'],
      sibling: json['sibling'],
      healthyName: json['healty'], // Selaras dengan backend
      selfstatusName: json['selfstatus_name'],
      edustatusName: json['edustatus_name'],
      employeeName: json['employee_name'],
      siblingName: json['sibling_name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nokp': nokp,
      'name': name,
      'mobile': mobile,
      'stshealthy': stshealthy,
      'selfstatus': selfstatus,
      'edustatus': edustatus,
      'employee': employee,
      'sibling': sibling,
    };
  }

  // Copy with method untuk kemaskini data
  People copyWith({
    int? id,
    String? nokp,
    String? name,
    String? mobile,
    int? stshealthy,
    int? selfstatus,
    int? edustatus,
    int? employee,
    int? sibling,
    String? healthyName,
    String? selfstatusName,
    String? edustatusName,
    String? employeeName,
    String? siblingName,
  }) {
    return People(
      id: id ?? this.id,
      nokp: nokp ?? this.nokp,
      name: name ?? this.name,
      mobile: mobile ?? this.mobile,
      stshealthy: stshealthy ?? this.stshealthy,
      selfstatus: selfstatus ?? this.selfstatus,
      edustatus: edustatus ?? this.edustatus,
      employee: employee ?? this.employee,
      sibling: sibling ?? this.sibling,
      healthyName: healthyName ?? this.healthyName,
      selfstatusName: selfstatusName ?? this.selfstatusName,
      edustatusName: edustatusName ?? this.edustatusName,
      employeeName: employeeName ?? this.employeeName,
      siblingName: siblingName ?? this.siblingName,
    );
  }
}
