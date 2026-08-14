import { useState, useEffect } from "react";
import PageComponent from "../components/PageComponent";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { UserGroupIcon, UserPlusIcon, HomeIcon, UserCircleIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axiosClient from "../axios";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const INITIAL_STATS = {
  totalKariah: 0,
  totalAhliKeluarga: 0,
  totalRumah: 0,
  residenStats: {
    kesihatan: {},
    pekerjaan: {},
    pelajaran: {},
    perkahwinan: {},
    gender: { 'Lelaki': 0, 'Perempuan': 0 }
  }
};

function Dashboard() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await axiosClient.get('/dashboard/stats');
        console.log('Dashboard stats:', statsResponse.data); // Untuk debug
        const dashboardStats = statsResponse.data.data || {};

        // Fetch kariah data
        const response = await axiosClient.get('/address');
        console.log('Address data:', response.data); // Untuk debug
        const addressData = response.data.data || [];

        // Initialize stats object
        const residenStats = {
          kesihatan: {},
          pekerjaan: {},
          pelajaran: {},
          perkahwinan: {},
          gender: { 'Lelaki': 0, 'Perempuan': 0 }
        };

        // Fetch all kariah details in parallel
        const kariahPromises = addressData.map(addr => 
          axiosClient.get(`/kariah/${addr.id}`)
            .catch(error => {
              console.error(`Error fetching kariah data for address ${addr.id}:`, error);
              return { data: { data: { people: [] } } }; // Return empty data on error
            })
        );

        const kariahResponses = await Promise.all(kariahPromises);

        // Process all kariah data
        kariahResponses.forEach(kariahResponse => {
          const people = kariahResponse.data.data.people || [];
          
          people.forEach(person => {
            // Count gender (1=lelaki, 2=perempuan)
            if (person.gender === 1) {
              residenStats.gender['Lelaki']++;
            } else if (person.gender === 2) {
              residenStats.gender['Perempuan']++;
            }

            // Count kesihatan
            if (person.healty) {
              residenStats.kesihatan[person.healty] = (residenStats.kesihatan[person.healty] || 0) + 1;
            }

            // Count pekerjaan
            if (person.employee) {
              residenStats.pekerjaan[person.employee] = (residenStats.pekerjaan[person.employee] || 0) + 1;
            }

            // Count pelajaran
            if (person.edustatus) {
              residenStats.pelajaran[person.edustatus] = (residenStats.pelajaran[person.edustatus] || 0) + 1;
            }

            // Count perkahwinan
            if (person.selfstatus) {
              residenStats.perkahwinan[person.selfstatus] = (residenStats.perkahwinan[person.selfstatus] || 0) + 1;
            }
          });
        });

        setStats(prevStats => ({
          ...prevStats,
          totalKariah: addressData.length,
          totalAhliKeluarga: dashboardStats.total_penduduk || 0,
          totalRumah: dashboardStats.total_rumah || 0,
          residenStats
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fungsi untuk kira peratusan
  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  // Fungsi untuk format nilai dengan suffix dan peratusan
  const formatValue = (value, type, total = null) => {
    if (value === undefined || value === null) return '0';
    
    let formattedValue = '';
    switch(type) {
      case 'rumah':
        formattedValue = `${value.toLocaleString()} buah`;
        break;
      case 'orang':
        formattedValue = `${value.toLocaleString()} orang`;
        break;
      case 'kariah':
        formattedValue = `${value.toLocaleString()} ketua`;
        break;
      default:
        formattedValue = value.toLocaleString();
    }

    if (total) {
      const percentage = calculatePercentage(value, total);
      formattedValue += ` (${percentage}%)`;
    }

    return formattedValue;
  };

  // Fungsi untuk transform data kepada format pie chart
  const transformToPieData = (data, title) => {
    if (!data) return [];
    
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    return Object.entries(data).map(([label, value]) => ({
      name: label,
      value: value,
      percentage: calculatePercentage(value, total)
    }));
  };

  const statCards = [
    {
      title: "Jumlah Kariah",
      value: formatValue(stats.totalKariah, 'kariah'),
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: "blue",
      footer: "Ketua Keluarga Berdaftar"
    },
    {
      title: "Jumlah Ahli Keluarga",
      value: formatValue(stats.totalAhliKeluarga, 'orang'),
      icon: <UserCircleIcon className="w-6 h-6" />,
      color: "green",
      footer: "Termasuk Tanggungan"
    },
    {
      title: "Jumlah Rumah",
      value: formatValue(stats.totalRumah, 'rumah'),
      icon: <HomeIcon className="w-6 h-6" />,
      color: "orange",
      footer: "Dalam Kawasan Kariah"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <PageComponent title="Dashboard Kariah">
      <div className="h-[calc(100vh-100px)] overflow-auto space-y-12 p-4 mt-3">
        {/* Statistik Utama */}
        <div className="flex flex-col md:flex-row gap-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="border border-blue-gray-100 flex-1">
              <CardHeader
                variant="gradient"
                color={stat.color}
                className="absolute -mt-4 grid h-16 w-16 place-items-center"
              >
                {stat.icon}
              </CardHeader>
              <CardBody className="p-6 text-right">
                <p className="text-sm text-blue-gray-600 font-normal">{stat.title}</p>
                <h4 className="text-2xl font-bold">{stat.value}</h4>
              </CardBody>
              <CardFooter className="border-t border-blue-gray-50 p-6">
                <p className="text-sm text-blue-gray-600 font-normal">
                  {stat.footer}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Statistik Terperinci */}
        <div className="flex flex-col gap-8">
          {/* Row 1: Jantina & Kesihatan */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Gender */}
            <Card className="flex-1">
              <CardHeader variant="gradient" color="blue" className="p-6">
                <Typography variant="h6" color="white">
                  Statistik Jantina
                </Typography>
              </CardHeader>
              <CardBody className="px-0 pt-0 pb-2">
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transformToPieData(stats.residenStats.gender)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                        >
                          {transformToPieData(stats.residenStats.gender).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatValue(value, 'orang')} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Kesihatan */}
            <Card className="flex-1">
              <CardHeader variant="gradient" color="green" className="p-6">
                <Typography variant="h6" color="white">
                  Statistik Kesihatan
                </Typography>
              </CardHeader>
              <CardBody className="px-0 pt-0 pb-2">
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transformToPieData(stats.residenStats.kesihatan)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                        >
                          {transformToPieData(stats.residenStats.kesihatan).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatValue(value, 'orang')} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Row 2: Pekerjaan */}
          <Card>
            <CardHeader variant="gradient" color="orange" className="p-6">
              <Typography variant="h6" color="white">
                Statistik Pekerjaan
              </Typography>
            </CardHeader>
            <CardBody className="px-0 pt-0 pb-2">
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transformToPieData(stats.residenStats.pekerjaan)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                      >
                        {transformToPieData(stats.residenStats.pekerjaan).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatValue(value, 'orang')} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Row 3: Pelajaran */}
          <Card>
            <CardHeader variant="gradient" color="purple" className="p-6">
              <Typography variant="h6" color="white">
                Statistik Pelajaran
              </Typography>
            </CardHeader>
            <CardBody className="px-0 pt-0 pb-2">
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transformToPieData(stats.residenStats.pelajaran)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                      >
                        {transformToPieData(stats.residenStats.pelajaran).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatValue(value, 'orang')} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageComponent>
  );
}

export default Dashboard;
