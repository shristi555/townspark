import toast from "react-hot-toast";

export const toaster = {
	success: (msg) => toast.success(msg),
	error: (msg) => toast.error(msg),
	info: (msg) => toast(msg),

	// You can also add your own custom versions
	loading: (msg) => toast.loading(msg),
};

export default toaster;
