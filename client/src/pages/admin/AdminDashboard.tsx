import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { api } from "../../lib/api";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { toast } from "react-toastify";
import type {
  BusListItem,
  DriverListItem,
  OwnerListItem,
  StudentListItem,
} from "../../types/domain";
import type { CreateStudentResponse } from "../../types/api";
import { DEFAULT_PASSWORD } from "../../constants/auth";
import { APP_ROUTES } from "../../constants/routes";
import { getErrorMessage } from "../../utils/errors";
import { AdminHeader } from "./components/AdminHeader";
import { AdminRouteNav } from "./components/AdminRouteNav";
import { StudentsCreateSection } from "./components/StudentsCreateSection";
import {
  StudentsTableSection,
  type StudentColumnKey,
} from "./components/StudentsTableSection";
import { DriversTableSection } from "./components/DriversTableSection";
import { BusesTableSection } from "./components/BusesTableSection";
import { OwnersCreateSection } from "./components/OwnersCreateSection";
import { OwnersTableSection } from "./components/OwnersTableSection";
import { StudentQrViewerModal } from "./components/StudentQrViewerModal";
import { StudentEditModal } from "./components/StudentEditModal";

type AdminSection =
  | "students"
  | "studentsCreate"
  | "drivers"
  | "buses"
  | "busOwners"
  | "busOwnersCreate";

const ADMIN_ROUTE_PATHS = {
  students: "/admin/students",
  studentsCreate: "/admin/students-create",
  drivers: "/admin/drivers",
  buses: "/admin/buses",
  busOwners: "/admin/bus-owners",
  busOwnersCreate: "/admin/bus-owners/create",
} as const;
const PAGE_SIZE = 10;

function getAdminSection(pathname: string): AdminSection | null {
  if (pathname === ADMIN_ROUTE_PATHS.students) return "students";
  if (pathname === ADMIN_ROUTE_PATHS.studentsCreate) return "studentsCreate";
  if (pathname === ADMIN_ROUTE_PATHS.drivers) return "drivers";
  if (pathname === ADMIN_ROUTE_PATHS.buses) return "buses";
  if (pathname === ADMIN_ROUTE_PATHS.busOwners) return "busOwners";
  if (pathname === ADMIN_ROUTE_PATHS.busOwnersCreate) return "busOwnersCreate";
  return null;
}

export function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const section = getAdminSection(location.pathname);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [buses, setBuses] = useState<BusListItem[]>([]);
  const [owners, setOwners] = useState<OwnerListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    isActive: true,
    image: null as File | null,
  });
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    phone: "",
    password: DEFAULT_PASSWORD,
  });
  const [createdStudentQR, setCreatedStudentQR] = useState<{
    studentId: string;
    name: string;
    qrToken: string;
  } | null>(null);
  const [viewingQR, setViewingQR] = useState<{
    studentId: string;
    name: string;
    qrToken: string;
  } | null>(null);
  const [studentToDelete, setStudentToDelete] =
    useState<StudentListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentListItem | null>(
    null,
  );
  const [editLoading, setEditLoading] = useState(false);
  const [editStudentForm, setEditStudentForm] = useState({
    name: "",
    email: "",
    isActive: true,
    image: null as File | null,
  });
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentsTotalPages, setStudentsTotalPages] = useState(1);
  const [studentsSearch, setStudentsSearch] = useState("");
  const [studentsStatusFilter, setStudentsStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [driversPage, setDriversPage] = useState(1);
  const [driversTotalPages, setDriversTotalPages] = useState(1);
  const [driversSearch, setDriversSearch] = useState("");
  const [busesPage, setBusesPage] = useState(1);
  const [busesTotalPages, setBusesTotalPages] = useState(1);
  const [busesSearch, setBusesSearch] = useState("");
  const [ownersPage, setOwnersPage] = useState(1);
  const [ownersTotalPages, setOwnersTotalPages] = useState(1);
  const [ownersSearch, setOwnersSearch] = useState("");
  const [studentVisibleColumns, setStudentVisibleColumns] = useState<
    Record<StudentColumnKey, boolean>
  >({
    studentId: true,
    name: true,
    email: true,
    image: true,
    status: true,
    qrToken: true,
    qrUsageCount: true,
    qrUsageTotal: true,
    actions: true,
  });

  useEffect(() => {
    if (location.pathname === APP_ROUTES.admin || location.pathname === `${APP_ROUTES.admin}/`) {
      navigate(ADMIN_ROUTE_PATHS.students, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (section !== "studentsCreate" && createdStudentQR) {
      setCreatedStudentQR(null);
    }
  }, [section, createdStudentQR]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.admin.students({
        page: studentsPage,
        pageSize: PAGE_SIZE,
        search: studentsSearch,
        isActive:
          studentsStatusFilter === "all"
            ? undefined
            : studentsStatusFilter === "active",
      });
      setStudents(response.students);
      setStudentsTotalPages(response.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [studentsPage, studentsSearch, studentsStatusFilter]);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.admin.drivers({
        page: driversPage,
        pageSize: PAGE_SIZE,
        search: driversSearch,
      });
      setDrivers(response.drivers);
      setDriversTotalPages(response.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [driversPage, driversSearch]);

  const fetchBuses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.admin.buses({
        page: busesPage,
        pageSize: PAGE_SIZE,
        search: busesSearch,
      });
      setBuses(response.buses);
      setBusesTotalPages(response.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [busesPage, busesSearch]);

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.admin.owners({
        page: ownersPage,
        pageSize: PAGE_SIZE,
        search: ownersSearch,
      });
      setOwners(response.owners);
      setOwnersTotalPages(response.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [ownersPage, ownersSearch]);

  useEffect(() => {
    if (section === "students") {
      void fetchStudents();
    } else if (section === "drivers") {
      void fetchDrivers();
    } else if (section === "buses") {
      void fetchBuses();
    } else if (section === "busOwners") {
      void fetchOwners();
    }
  }, [section, fetchStudents, fetchDrivers, fetchBuses, fetchOwners]);

  const handleLogout = useCallback(() => {
    logout();
    navigate(APP_ROUTES.login);
  }, [logout, navigate]);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const handleNavigateToCreateStudent = useCallback(() => {
    navigate(ADMIN_ROUTE_PATHS.studentsCreate);
  }, [navigate]);

  const handleNavigateToCreateOwner = useCallback(() => {
    navigate(ADMIN_ROUTE_PATHS.busOwnersCreate);
  }, [navigate]);

  const handleCloseCreatedQr = useCallback(() => {
    setCreatedStudentQR(null);
  }, []);

  const handleNewStudentNameChange = useCallback((value: string) => {
    setNewStudent((s) => ({ ...s, name: value }));
  }, []);

  const handleNewStudentEmailChange = useCallback((value: string) => {
    setNewStudent((s) => ({ ...s, email: value }));
  }, []);

  const handleNewStudentIsActiveChange = useCallback((value: boolean) => {
    setNewStudent((s) => ({ ...s, isActive: value }));
  }, []);

  const handleNewStudentImageChange = useCallback((file: File | null) => {
    setNewStudent((s) => ({ ...s, image: file }));
  }, []);

  const handleNewOwnerNameChange = useCallback((value: string) => {
    setNewOwner((s) => ({ ...s, name: value }));
  }, []);

  const handleNewOwnerEmailChange = useCallback((value: string) => {
    setNewOwner((s) => ({ ...s, email: value }));
  }, []);

  const handleNewOwnerPhoneChange = useCallback((value: string) => {
    setNewOwner((s) => ({ ...s, phone: value }));
  }, []);

  const handleNewOwnerPasswordChange = useCallback((value: string) => {
    setNewOwner((s) => ({ ...s, password: value }));
  }, []);

  async function handleCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await api.admin.createStudent({
        name: newStudent.name,
        email: newStudent.email || undefined,
        isActive: newStudent.isActive,
        image: newStudent.image ?? undefined,
      });
      const qrStudentResult: CreateStudentResponse = result;
      setCreatedStudentQR({
        studentId: qrStudentResult.studentId,
        name: qrStudentResult.name,
        qrToken: qrStudentResult.qrToken,
      });
      setNewStudent({ name: "", email: "", isActive: true, image: null });
      navigate(ADMIN_ROUTE_PATHS.students);
      setStudentsPage(1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Չհաջողվեց ստեղծել ուսանող"));
    }
  }

  async function handleCreateOwner(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.admin.createOwner(
        newOwner.name,
        newOwner.email,
        newOwner.password,
        newOwner.phone || undefined,
      );
      setNewOwner({
        name: "",
        email: "",
        phone: "",
        password: DEFAULT_PASSWORD,
      });
      navigate(ADMIN_ROUTE_PATHS.busOwners);
      setOwnersPage(1);
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Չհաջողվեց ստեղծել ավտոբուսի սեփականատեր"),
      );
    }
  }

  async function handleConfirmDeleteStudent() {
    if (!studentToDelete) return;
    setDeleteLoading(true);
    try {
      await api.admin.deleteStudent(studentToDelete.id);
      await fetchStudents();
      setStudentToDelete(null);
      toast.success("Ուսանողը հեռացվել է");
    } catch (err) {
      toast.error(getErrorMessage(err, "Չհաջողվեց հեռացնել ուսանողին"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const handleStudentsSearchChange = useCallback((value: string) => {
    setStudentsSearch(value);
    setStudentsPage(1);
  }, []);

  const handleStudentsStatusFilterChange = useCallback(
    (value: "all" | "active" | "inactive") => {
      setStudentsStatusFilter(value);
      setStudentsPage(1);
    },
    [],
  );

  const handleToggleStudentColumn = useCallback((column: StudentColumnKey) => {
    setStudentVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  }, []);

  const openEditStudent = useCallback((student: StudentListItem) => {
    setStudentToEdit(student);
    setEditStudentForm({
      name: student.name,
      email: student.email ?? "",
      isActive: student.isActive,
      image: null,
    });
  }, []);

  const handleViewQr = useCallback((student: StudentListItem) => {
    if (!student.qrToken) return;

    setViewingQR({
      studentId: student.studentId,
      name: student.name,
      qrToken: student.qrToken,
    });
  }, []);

  const handleCloseViewingQr = useCallback(() => {
    setViewingQR(null);
  }, []);

  const handleEditNameChange = useCallback((value: string) => {
    setEditStudentForm((s) => ({ ...s, name: value }));
  }, []);

  const handleEditEmailChange = useCallback((value: string) => {
    setEditStudentForm((s) => ({ ...s, email: value }));
  }, []);

  const handleEditIsActiveChange = useCallback((value: boolean) => {
    setEditStudentForm((s) => ({ ...s, isActive: value }));
  }, []);

  const handleEditImageChange = useCallback((file: File | null) => {
    setEditStudentForm((s) => ({ ...s, image: file }));
  }, []);

  const handleCloseStudentEdit = useCallback(() => {
    setStudentToEdit(null);
  }, []);

  async function handleEditStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!studentToEdit) return;
    setEditLoading(true);
    try {
      const updated = await api.admin.updateStudent(studentToEdit.id, {
        name: editStudentForm.name,
        email: editStudentForm.email || undefined,
        isActive: editStudentForm.isActive,
        image: editStudentForm.image ?? undefined,
      });
      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentToEdit.id
            ? {
                ...student,
                name: updated.name,
                email: updated.email,
                isActive: updated.isActive,
                imageUrl: updated.imageUrl,
              }
            : student,
        ),
      );
      setStudentToEdit(null);
      toast.success("Ուսանողի տվյալները թարմացվել են");
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Չհաջողվեց թարմացնել ուսանողի տվյալները"),
      );
    } finally {
      setEditLoading(false);
    }
  }

  if (!section) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto p-4">
        <AdminRouteNav
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          paths={ADMIN_ROUTE_PATHS}
        />

        {section === "studentsCreate" && (
          <StudentsCreateSection
            createdStudentQR={createdStudentQR}
            onCloseCreatedQr={handleCloseCreatedQr}
            onSubmit={handleCreateStudent}
            form={newStudent}
            onNameChange={handleNewStudentNameChange}
            onEmailChange={handleNewStudentEmailChange}
            onIsActiveChange={handleNewStudentIsActiveChange}
            onImageChange={handleNewStudentImageChange}
          />
        )}

        {section === "students" && (
          <div className="space-y-6">
            <StudentsTableSection
              loading={loading}
              students={students}
              onCreate={handleNavigateToCreateStudent}
              search={studentsSearch}
              onSearchChange={handleStudentsSearchChange}
              statusFilter={studentsStatusFilter}
              onStatusFilterChange={handleStudentsStatusFilterChange}
              page={studentsPage}
              totalPages={studentsTotalPages}
              onPageChange={setStudentsPage}
              visibleColumns={studentVisibleColumns}
              onToggleColumn={handleToggleStudentColumn}
              onViewQr={handleViewQr}
              onEdit={openEditStudent}
              onDelete={setStudentToDelete}
            />
            <StudentQrViewerModal data={viewingQR} onClose={handleCloseViewingQr} />
          </div>
        )}

        {section === "drivers" && (
          <DriversTableSection
            loading={loading}
            drivers={drivers}
            search={driversSearch}
            onSearchChange={(value) => {
              setDriversSearch(value);
              setDriversPage(1);
            }}
            page={driversPage}
            totalPages={driversTotalPages}
            onPageChange={setDriversPage}
          />
        )}

        {section === "buses" && (
          <BusesTableSection
            loading={loading}
            buses={buses}
            search={busesSearch}
            onSearchChange={(value) => {
              setBusesSearch(value);
              setBusesPage(1);
            }}
            page={busesPage}
            totalPages={busesTotalPages}
            onPageChange={setBusesPage}
          />
        )}

        {section === "busOwnersCreate" && (
          <OwnersCreateSection
            form={newOwner}
            onSubmit={handleCreateOwner}
            onNameChange={handleNewOwnerNameChange}
            onEmailChange={handleNewOwnerEmailChange}
            onPhoneChange={handleNewOwnerPhoneChange}
            onPasswordChange={handleNewOwnerPasswordChange}
          />
        )}

        {section === "busOwners" && (
          <OwnersTableSection
            loading={loading}
            owners={owners}
            onCreate={handleNavigateToCreateOwner}
            search={ownersSearch}
            onSearchChange={(value) => {
              setOwnersSearch(value);
              setOwnersPage(1);
            }}
            page={ownersPage}
            totalPages={ownersTotalPages}
            onPageChange={setOwnersPage}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        title="Հեռացնե՞լ ուսանողին"
        description={
          studentToDelete
            ? `${studentToDelete.name} ուսանողը կհեռացվի, ներառյալ նկարը։`
            : ""
        }
        confirmText="Հեռացնել"
        cancelText="Չեղարկել"
        onConfirm={handleConfirmDeleteStudent}
        onCancel={() => {
          if (!deleteLoading) {
            setStudentToDelete(null);
          }
        }}
        loading={deleteLoading}
      />

      <StudentEditModal
        student={studentToEdit}
        loading={editLoading}
        form={editStudentForm}
        onClose={handleCloseStudentEdit}
        onSubmit={handleEditStudent}
        onNameChange={handleEditNameChange}
        onEmailChange={handleEditEmailChange}
        onIsActiveChange={handleEditIsActiveChange}
        onImageChange={handleEditImageChange}
      />
    </div>
  );
}
