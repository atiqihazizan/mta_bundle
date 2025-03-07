import { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { PersonAdd } from "react-bootstrap-icons";
import Card from "../../components/Card";
import TButton from "../../components/Core/TButton";
import FormC from "../../components/FormContext";
import axiosClient from "../../axios";
import Modal from "../../components/Modal";

export default function PeopleView({ title, addr_id, data, cols }) {
  const { showToast } = useStateContext();
  const [columns, setColumns] = useState();
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [statusData, setStatus] = useState([]);
  const [educData, setEduc] = useState([]);
  const [siblingData, setSibling] = useState([]);
  const [jobData, setJob] = useState([]);
  const [marriedData, setMarried] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [senaraiFamili, setSenaraiFamili] = useState(data || []);

  useEffect(() => {
    setSenaraiFamili(data || []);
  }, [data]);

  const _cols = [
    {
      name: "No. K/P",
      field: "nokp",
      nClass: "w-[100px] text-left",
      nClassRow: "text-left text-sm font-normal text-gray-700",
    },
    {
      name: "Nama",
      field: "name",
      nClass: "text-left",
      nClassRow: "text-left",
    },
    {
      name: "No. Tel",
      field: "mobile",
      nClass: "w-[100px] text-left",
      nClassRow: "text-left text-sm font-normal text-gray-700",
    },
    {
      name: "Pelajaran",
      field: "edustatus",
      nClass: "w-[170px] text-left",
      nClassRow: "text-left text-sm font-normal text-gray-700",
    },
    {
      name: "Hubungan",
      field: "sibling",
      nClass: "w-[110px] text-left",
      nClassRow: "text-left text-sm font-normal text-gray-700",
    },
    {
      name: "Pekerjaan",
      field: "employee",
      nClass: "w-[170px] text-left",
      nClassRow: "text-left text-sm font-normal text-gray-700",
    },
  ];

  const option = {
    headable: false,
    checkable: false,
    nClassTable: "table-auto",
  };

  const onDelete = (ev, id, ppl_id) => {
    ev.preventDefault();
    
    // Dapatkan jenis delete dari pengguna
    const deleteType = window.confirm(
      'PERHATIAN: Sila pilih tindakan yang dikehendaki\n\n' +
      'Tekan OK - Keluarkan dari alamat ini sahaja\n' +
      'Tekan BATAL - Padam rekod terus dari sistem'
    );

    // Dapatkan pengesahan terakhir
    if (!window.confirm('Adakah anda pasti untuk melaksanakan tindakan ini?')) {
      return;
    }

    // Hantar permintaan delete ke backend guna ppl_id
    axiosClient
      .delete(`/peoples/${ppl_id}`, {
        params: {
          deleteType: deleteType ? 'address' : 'permanent'
        }
      })
      .then(({ data: result }) => {
        // Papar mesej kejayaan dari backend
        showToast(result.message);
        
        // Kemaskini senarai famili guna kariah id
        setSenaraiFamili(prev => 
          prev.filter(item => item.id !== id)
        );
      })
      .catch((err) => {
        // Papar mesej ralat dari backend
        showToast(err.response?.data?.message || 'Ralat semasa memadam data', 'error');
      });
  };

  const onEdit = (ev, id) => {
    ev.preventDefault();
    const _pre = data.find((d) => d.id === id);
    axiosClient
      .get(`/peoples/${_pre.ppl_id}/detail`)
      .then(({ data: { people, kariahData } }) => {
        // Gabungkan data people dan kariah
        setFormData({
          ...people,
          id: _pre.ppl_id, // Guna people ID
          name: _pre.name,
          addr_id: addr_id,  // Guna addr_id dari props
          relation: kariahData?.relation,
          status: kariahData?.status,
          tanggungan: kariahData?.tanggungan,
          penama: kariahData?.penama
        });
        setIsEdit(true);
        setShowModal(true);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        showToast('Ralat semasa mengambil data', 'error');
      });
  };

  const onSave = (ev) => {
    ev.preventDefault();
    setError(null);

    const saveData = {
      addr_id: addr_id,
      ...formData
    };
    
    const endpoint = isEdit 
      ? `/peoples/${formData.id}` 
      : '/peoples';
    const method = isEdit ? 'put' : 'post';

    axiosClient[method](endpoint, saveData)
      .then(({ data: result }) => {
        if (result.errors) throw result.errors;
        
        const successMsg = isEdit ? 'dikemaskini' : 'ditambah';
        showToast(`Data ${result?.data?.name} berjaya ${successMsg}`);
        
        if (isEdit) {
          // Kemaskini senarai famili untuk edit
          const newData = senaraiFamili.map(item => 
            item.ppl_id === formData.id ? result.data : item
          );
          setSenaraiFamili(newData);
        } else {
          // // Format data baru untuk seragamkan struktur
          // const newPerson = {
          //   ...result.data,
          //   id: result.data.kariah_id, // Guna kariah_id sebagai id
          //   ppl_id: result.data.id, // Simpan id people sebagai ppl_id
          //   nokp: result.data.nokp,
          //   name: result.data.name,
          //   mobile: result.data.mobile,
          //   edustatus: result.data.edustatus,
          //   sibling: result.data.sibling,
          //   employee: result.data.employee,
          //   stshealthy: result.data.stshealthy
          // };
          setSenaraiFamili([...senaraiFamili, result.data ]);
        }

        setShowModal(false);
        setFormData({});
        setIsEdit(false);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      });
  };

  useEffect(() => {
    const ar = cols.split(",");
    // const aCol = _cols.filter((f) => ar.includes(f.field)).map((c) => c);
    const myCols = [
      ..._cols,
      {
        name: "Sakit Berpanjangan",
        nClass: "w-[100px] text-left",
        nClassRow: "text-center text-sm font-normal text-gray-700",
        render: ({ id: kid, ppl_id: id, stshealthy }) =>
          stshealthy === 2 ? (
            <i className="ki-solid ki-pulse text-danger"></i>
          ) : null,
      },
      {
        name: "Tanggungan",
        nClass: "w-[100px] text-left",
        nClassRow: "text-center text-sm font-normal text-gray-700",
        render: ({ id: kid, ppl_id: id, tanggungan }) =>
          tanggungan === 1 ? (
            <i className="ki-solid ki-pin text-danger"></i>
          ) : null,
      },
      {
        name: "",
        class: "w-[50px]",
        nClassRow: "px-3",
        render: ({ id: kid, ppl_id: id }) => (
          <div className="flex gap-0.5">
            <TButton
              nClasses="btn btn-sm btn-icon btn-clear btn-primary"
              onClick={(ev) => onEdit(ev, kid)}
            >
              <i className="ki-outline ki-user-edit"></i>
            </TButton>
            <TButton
              nClasses="btn btn-sm btn-icon btn-clear btn-danger"
              onClick={(ev) => onDelete(ev, kid, id)}
            >
              <i className="ki-outline ki-trash"></i>
            </TButton>
          </div>
        ),
      },
    ];
    setColumns(myCols);
  }, []);
  


  useEffect(() => {
    if (showModal) {
      axiosClient
        .get("/newpeople")
        .then(({ data: { education, job, married, sibling, status } }) => {
          setEduc(() =>
            education.reduce((a, c) => {
              return [...a, { key: c.id, value: c.name }];
            }, [])
          );
          setJob(() =>
            job.reduce((a, c) => {
              return [...a, { key: c.id, value: c.name }];
            }, [])
          );
          setMarried(() =>
            married.reduce((a, c) => {
              return [...a, { key: c.id, value: c.name }];
            }, [])
          );
          setSibling(() =>
            sibling.reduce((a, c) => {
              return [...a, { key: c.id, value: c.name }];
            }, [])
          );
          setStatus(() =>
            status.reduce((a, c) => {
              return [...a, { key: c.id, value: c.name }];
            }, [])
          );
        });
    }
  }, [showModal]);

  return (
    <>
      <Card>
        <Card.Header title={title}>
          <div className="flex gap-2">
            <TButton
              nClasses="btn btn-sm btn-icon btn-clear btn-primary"
              onClick={() => setShowModal(true)}
            >
              <PersonAdd className="w-5 h-5" />
            </TButton>
          </div>
        </Card.Header>
        <Card.Table
          columns={columns}
          data={senaraiFamili}
          oOption={{ checkable: false }}
        />
      </Card>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({});
          setIsEdit(false);
        }}
        title={isEdit ? 'Kemaskini Ahli' : 'Tambah Ahli Baru'}
      >
        <form onSubmit={(ev) => onSave(ev)}>
          <FormC data={formData} setValue={setFormData} error={error}>
            <div className="flex justify-between gap-7 mb-4">
              <div className="flex flex-col gap-5 w-full">
                <FormC.LText
                  text={"Nama Penuh"}
                  field={"name"}
                  classes="uppercase"
                />
                <FormC.LText text={"Nama Panggilan"} field={"nickname"} />
                <FormC.LNumber text={"No K/P"} field={"nokp"} />
                <FormC.LNumber text={"Telefon Bimbit"} field={"mobile"} />
                <FormC.LSelect
                  text={"Perkahwinan"}
                  field={"married_id"}
                  keyval="key,value"
                  listArr={marriedData}
                />
                <FormC.LSelect
                  text={"Pekerjaan"}
                  field={"job_id"}
                  keyval="key,value"
                  listArr={jobData}
                />
                <FormC.LSelect
                  text={"Pendidikan"}
                  field={"edu_id"}
                  keyval="key,value"
                  listArr={educData}
                />
                <FormC.LCheckbox
                  text=""
                  field={"stshealthy"}
                  text2="Sakit Berpanjangan"
                  val={2}
                />
                {formData?.stshealthy === 2 && (
                  <FormC.LText
                    text={"Penyakit yang dihidap"}
                    field={"penyakit"}
                  />
                )}
                <FormC.LCheckbox
                  text=""
                  field={"stspencen"}
                  text2="Persara pencen"
                  val={1}
                />
                {formData?.stspencen > 0 && (
                  <FormC.LText text={"Pesara sebagai"} field={"pencen"} />
                )}
                <FormC.LSelect
                  text={"Hubungan"}
                  field={"relation"}
                  keyval="key,value"
                  listArr={siblingData}
                />
                <FormC.LSelect
                  text={"Status"}
                  field={"status"}
                  keyval="key,value"
                  listArr={statusData}
                />
                <FormC.LCheckbox
                  text=""
                  field={"tanggungan"}
                  text2="Sebagai Tanggungan"
                  val={1}
                />
              </div>
            </div>
            <FormC.FSave />
          </FormC>
        </form>
      </Modal>
    </>
  );
}
