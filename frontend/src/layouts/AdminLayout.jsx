import AdminNavigation from '../components/AdminNavigation';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex">
            <AdminNavigation />
            <div className="flex-1 lg:ml-64">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
