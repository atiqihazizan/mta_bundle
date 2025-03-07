import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import 'package:provider/provider.dart';
import 'package:get_it/get_it.dart';

import 'config/routes.dart';
import 'services/auth_service.dart';
import 'services/people_service.dart';
import 'services/address_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize services
  final prefs = await SharedPreferences.getInstance();
  final dio = Dio();
  
  // Setup service locator
  final getIt = GetIt.instance;
  getIt.registerSingleton<SharedPreferences>(prefs);
  getIt.registerSingleton<Dio>(dio);
  getIt.registerSingleton<AuthService>(AuthService(prefs));
  getIt.registerSingleton<PeopleService>(PeopleService(dio, prefs));
  getIt.registerSingleton<AddressService>(AddressService(dio, prefs));

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MTA Mobile',
      theme: ThemeData(
        primarySwatch: Colors.green,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(),
          contentPadding: EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
      ),
      // Gunakan AppRouter untuk handle routing
      onGenerateRoute: AppRouter.generateRoute,
      // Mulakan dari login screen
      initialRoute: '/login',
    );
  }
}
