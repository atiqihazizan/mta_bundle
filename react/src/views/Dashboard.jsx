import { useState, useEffect } from "react";
import PageComponent from "../components/PageComponent";
import { Card, CardHeader, CardBody, CardFooter, Typography, Avatar } from "@material-tailwind/react";
import { UserGroupIcon, UserPlusIcon, HomeIcon, UserCircleIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axiosClient from "../axios";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const INITIAL_STATS = {
  totalKariah: 0,
  totalAhliKeluarga: 0,
  totalRumah: 0,
  kadiahBaru: 0,
  zoneStats: {
    'Zone A': 0,
    'Zone B': 0,
    'Zone C': 0,
    'Zone D': 0
  },
  newKariahList: []
};

function Dashboard() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Uncomment ini bila API sudah siap
        // const response = await axiosClient.get('/dashboard/stats');
        // setStats({
        //   ...INITIAL_STATS,
        //   ...response.data
        // });

        // Data dummy sementara
        setStats({
          totalKariah: 250,
          totalAhliKeluarga: 1000,
          totalRumah: 200,
          kadiahBaru: 15,
          zoneStats: {
            'Zone A': 75,
            'Zone B': 60,
            'Zone C': 65,
            'Zone D': 50
          },
          newKariahList: [
            { id: 1, nama: 'Ahmad bin Abdullah', alamat: 'No. 123, Jalan Masjid', tarikh: '2025-03-01', zone: 'Zone A' },
            { id: 2, nama: 'Siti binti Hassan', alamat: 'No. 45, Lorong Imam', tarikh: '2025-03-02', zone: 'Zone B' },
            { id: 3, nama: 'Muhammad bin Ibrahim', alamat: 'No. 67, Jalan Taqwa', tarikh: '2025-03-03', zone: 'Zone C' },
            { id: 4, nama: 'Fatimah binti Omar', alamat: 'No. 89, Lorong Solat', tarikh: '2025-03-04', zone: 'Zone D' },
            { id: 5, nama: 'Ismail bin Yusof', alamat: 'No. 12, Jalan Iman', tarikh: '2025-03-05', zone: 'Zone A' }
          ]
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform zone stats untuk pie chart
  const pieData = Object.entries(stats.zoneStats).map(([zone, value], index) => ({
    name: zone,
    value: value,
    percentage: Math.round((value / (Object.values(stats.zoneStats).reduce((a, b) => a + b, 0) || 1)) * 100),
    fill: COLORS[index % COLORS.length]
  }));

  // Custom label untuk pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {name} ({`${(percent * 100).toFixed(0)}%`})
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Jumlah Kariah",
      value: stats.totalKariah,
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: "blue",
      footer: "Ketua Keluarga Berdaftar"
    },
    {
      title: "Jumlah Ahli Keluarga",
      value: stats.totalAhliKeluarga,
      icon: <UserCircleIcon className="w-6 h-6" />,
      color: "green",
      footer: "Termasuk Tanggungan"
    },
    {
      title: "Jumlah Rumah",
      value: stats.totalRumah,
      icon: <HomeIcon className="w-6 h-6" />,
      color: "orange",
      footer: "Dalam Kawasan Kariah"
    },
    {
      title: "Kariah Baru",
      value: stats.kadiahBaru,
      icon: <UserPlusIcon className="w-6 h-6" />,
      color: "purple",
      footer: "Bulan Ini"
    }
  ];

  const zoneColors = {
    'Zone A': '#2196f3',
    'Zone B': '#4caf50',
    'Zone C': '#ff9800',
    'Zone D': '#9c27b0'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium">{data.name}</p>
          <p className="text-gray-600">Jumlah: {data.value}</p>
          <p className="text-gray-600">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageComponent title="Dashboard Kariah">
      <div className="h-[calc(100vh-100px)] overflow-auto space-y-12 p-4 mt-3">
        {/* Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="border border-blue-gray-100">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Graf Statistik */}
          <Card className="col-span-2 h-full">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-8 p-6"
            >
              <Typography variant="h6" color="white">
                Peratusan Kariah Mengikut Zone
              </Typography>
            </CardHeader>
            <CardBody className="p-6">
              <div className="h-[450px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={180}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <p className="font-bold">{data.name}</p>
                              <p>Kariah: {data.value}</p>
                              <p>Peratusan: {data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Senarai Kariah Baru */}
          <Card className="h-full">
            <CardHeader
              variant="gradient"
              color="purple"
              className="mb-8 p-6"
            >
              <Typography variant="h6" color="white">
                Kariah Baru
              </Typography>
            </CardHeader>
            <CardBody className="p-6">
              <div 
                className="custom-scrollbar h-[400px] overflow-auto"
              >
                <ul role="list" className="divide-y divide-gray-200 -my-2">
                  {(stats.newKariahList || []).map((kariah) => (
                    <li key={kariah.id} className="py-4 px-2 hover:bg-blue-gray-50/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Avatar
                            variant="circular"
                            alt={kariah.nama}
                            className="p-1"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(kariah.nama)}&background=random`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {kariah.nama}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {kariah.alamat}
                          </p>
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            {kariah.zone}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">
                          {new Date(kariah.tarikh).toLocaleDateString('ms-MY')}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageComponent>
  );
}

export default Dashboard;
