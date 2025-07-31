import authApi from "@/api/auth";
import userApi from "@/api/user";
import { useToast } from "@/hooks/use-toast";
import { selectUserInfo } from "@/redux/selectors/userSelectors";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/userSlice";

const Profile = () => {
  const { toast } = useToast();
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (userInfo?.name) {
      const [firstName = "", ...lastParts] = userInfo?.name.trim().split(" ");
      const lastName = lastParts.join(" ");
      setPersonalInfo({
        firstName,
        lastName,
        email: userInfo?.email,
      });
    }
  }, [userInfo]);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullName = `${personalInfo?.firstName} ${personalInfo?.lastName}`;
      const body = { name: fullName };

      await userApi.updatedUser(userInfo?.id, body);

      const updatedUser = {
        ...userInfo,
        name: fullName,
      };

      localStorage.setItem("user_info", JSON.stringify(updatedUser));

      dispatch(login(updatedUser));

      toast({
        title: "Profile updated",
        description: "Your profile information was successfully updated.",
      });
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords?.newPassword !== passwords?.confirmPassword) {
      return toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
    }

    try {
      const body = {
        oldPassword: passwords?.oldPassword,
        newPassword: passwords?.newPassword,
      };
      await authApi.changePassword(body);
      toast({
        title: "Password changed",
        description: "Your password was successfully updated.",
      });

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPassword({
        old: false,
        new: false,
        confirm: false,
      });
    } catch (err) {
      console.error("Password change error:", err);
      toast({
        title: "Password change failed",
        description: "There was a problem changing your password.",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <div className=" mx-auto p-4 space-y-10">
        <form onSubmit={handlePersonalSubmit} className="space-y-4 p-4 ">
          <h2 className="text-xl font-semibold">Personal Info</h2>
          <input
            type="text"
            placeholder="First Name"
            value={personalInfo.firstName}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, firstName: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={personalInfo.lastName}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, lastName: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            value={personalInfo.email}
            readOnly
            className="w-full bg-gray-100 border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update Info
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-4 p-4 rounded "
        >
          <h2 className="text-xl font-semibold">Change Password</h2>
          <div className="relative">
            <input
              type={showPassword.old ? "text" : "password"}
              placeholder="Old Password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, old: !prev.old }))
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
