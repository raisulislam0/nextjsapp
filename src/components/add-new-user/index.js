"use client";

import { addNewUserAction, editUserAction } from "@/actions";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addNewUserFormControls, addNewUserFormInitialState } from "@/utils";
import { useContext, useState } from "react";
import { UserContext } from "@/context";

function AddNewUser() {
  const {
    openPopup,
    setOpenPopup,
    addNewUserFormData,
    setAddNewUserFormData,
    currentEditedID,
    setCurrentEditedID,
  } = useContext(UserContext);
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSaveButtonValid() {
    return Object.keys(addNewUserFormData).every(
      (key) => addNewUserFormData[key].trim() !== ""
    );
  }

  async function handleAddNewUserAction() {
    setIsSubmitting(true);
    setValidationErrors({});
    
    console.log("Submitting form data:", addNewUserFormData);
    
    const result = currentEditedID !== null
      ? await editUserAction(currentEditedID, addNewUserFormData, "/user-management")
      : await addNewUserAction(addNewUserFormData, "/user-management");

    console.log("Received result:", result);

    if (result.success) {
      setOpenPopup(false);
      setAddNewUserFormData(addNewUserFormInitialState);
      setCurrentEditedID(null);
    } else if (result.errors) {
      const errorObject = {};
      result.errors.forEach(error => {
        errorObject[error.path] = error.message;
      });
      setValidationErrors(errorObject);
    }
    
    setIsSubmitting(false);
  }

  function handleInputChange(event, controlItem) {
    const newValue = event.target.value;
    setAddNewUserFormData({
      ...addNewUserFormData,
      [controlItem.name]: newValue,
    });
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[controlItem.name]) {
      setValidationErrors({
        ...validationErrors,
        [controlItem.name]: undefined
      });
    }
  }

  return (
    <div>
      <Button onClick={() => setOpenPopup(true)}>Add New User</Button>
      <Dialog
        open={openPopup}
        onOpenChange={() => {
          setOpenPopup(false);
          setAddNewUserFormData(addNewUserFormInitialState);
          setCurrentEditedID(null);
          setValidationErrors({});
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentEditedID !== null ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            await handleAddNewUserAction();
          }} className="grid gap-4 py-4">
            {addNewUserFormControls.map((controlItem) => (
              <div className="mb-5" key={controlItem.name}>
                <Label htmlFor={controlItem.name} className="text-right">
                  {controlItem.label}
                </Label>
                <Input
                  id={controlItem.name}
                  name={controlItem.name}
                  placeholder={controlItem.placeholder}
                  className={`col-span-3 ${
                    validationErrors[controlItem.name] ? 'border-red-500' : ''
                  }`}
                  type={controlItem.type}
                  value={addNewUserFormData[controlItem.name]}
                  onChange={(event) => handleInputChange(event, controlItem)}
                />
                {validationErrors[controlItem.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors[controlItem.name]}
                  </p>
                )}
              </div>
            ))}
            <DialogFooter>
              <Button
                className="disabled:opacity-55"
                disabled={!handleSaveButtonValid() || isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewUser;