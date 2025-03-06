import { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { PersonAdd } from "react-bootstrap-icons";
import Card from "../../components/Card";
import TButton from "../../components/Core/TButton";
import FormC from "../../components/FormContext";
import axiosClient from "../../axios";
import Modal from "../../components/Modal";

export default function PeopleView({ title, addr_id, data, cols, updated }) {
  const [columns, setColumns] = useState();
  const [person, setPerson] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPerson, setNewPerson] = useState({});
  const [sibling, setRelation] = useState(false);
  const [error, setError] = useState(null);
  const [educData, setEduc] = useState([]);
  const [siblingData, setSibling] = useState([]);
  const [jobData, setJob] = useState([]);
  const [marriedData, setMarried] = useState([]);
  const { showToast } = useStateContext();
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

  const onEdit = (ev, id) => {
    ev.preventDefault();
    const _pre = data.filter((d) => d.id == id)[0];
    axiosClient
      .get("/kariah/people/" + id)
      .then(({ data: { relation, status, self } }) => {
        setRelation(relation);
        setPerson({ ...self, name: _pre.name });
      });
  };
  const onSave = (ev) => {
    const { name, id, ...payload } = person;
    const _pre = data.filter((d) => d.id == id)[0];
    ev.preventDefault();
    setError(null);
    axiosClient
      .put("/kariah/" + id, payload)
      .then(({ data: result }) => {
        if (result.errors) throw result.errors;
        showToast(`Kemaskini maklumat ${name}`);
        updated(result?.data);
        setPerson(false);
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
          stshealthy === 1 ? (
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
              to={`/people/${id}`}
            >
              <i className="ki-outline ki-user-edit">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </TButton>
            <TButton
              nClasses="btn btn-sm btn-icon btn-clear btn-primary"
              onClick={(ev) => onEdit(ev, kid)}
            >
              <i className="ki-outline ki-setting-2"></i>
            </TButton>
          </div>
        ),
      },
    ];
    setColumns(myCols);
  }, []);
  
  const onNewPerson = (ev) => {
    ev.preventDefault();
    setError(null);
    const newData = {
      ...newPerson,
      addr_id: addr_id,
    };

    console.log(newData);
    return;
    axiosClient
      .post("/peoples", newPerson)
      .then(({ data: result }) => {
        if (result.errors) throw result.errors;
        showToast(`Tambah ahli baru ${result?.data?.name}`);
        updated(result?.data);
        setShowModal(false);
        setNewPerson({});
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      });
  };

  useEffect(() => {
    if (showModal) {
      axiosClient
        .get("/newpeople")
        .then(({ data: { education, job, married, sibling } }) => {
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
        {!person && (
          <Card.Table
            columns={columns}
            data={data}
            oOption={{ checkable: false }}
          />
        )}
      </Card>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setNewPerson({});
        }}
        title="Tambah Ahli Baru"
      >
        <form onSubmit={(ev) => onNewPerson(ev)}>
          <FormC data={newPerson} setValue={setNewPerson} error={error}>
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
                  val={1}
                />
                {newPerson?.stshealthy > 0 && (
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
                {newPerson?.stspencen > 0 && (
                  <FormC.LText text={"Pesara sebagai"} field={"pencen"} />
                )}
                <FormC.LSelect
                  text={"Hubungan"}
                  field={"sibling"}
                  keyval="key,value"
                  listArr={siblingData}
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
