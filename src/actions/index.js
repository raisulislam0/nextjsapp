"use server";

import { z } from "zod";
import connectToDB from "@/database";
import User from "@/models/user";
import { revalidatePath } from "next/cache";

// Add debug logging to the containsNoNumbers function
const containsNoNumbers = (value) => {
  const result = !/\d/.test(value);
  console.log(`Checking for numbers in: ${value}, result: ${result}`);
  return result;
};

// Define Zod schema for validation with enhanced name checks and debug logging
const UserSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .refine(containsNoNumbers, {
      message: "First name should not contain numbers"
    }),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .refine(containsNoNumbers, {
      message: "Last name should not contain numbers"
    }),
  email: z.string()
    .email("Invalid email address")
    .max(100, "Email must not exceed 100 characters"),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters")
});

// Helper function to handle validation with enhanced logging
async function validateData(schema, data) {
  console.log("Validating data:", data);
  try {
    const validatedData = schema.parse(data);
    console.log("Validation successful:", validatedData);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      console.log("Validation failed:", errors);
      return { success: false, errors };
    }
    console.log("Unknown validation error:", error);
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
}

// Add new user action with enhanced error logging
export async function addNewUserAction(formData, pathToRevalidate) {
  console.log("Received form data in addNewUserAction:", formData);
  
  try {
    await connectToDB();

    // Validate form data
    const validationResult = await validateData(UserSchema, formData);
    
    if (!validationResult.success) {
      console.log("Validation failed in addNewUserAction:", validationResult.errors);
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.errors
      };
    }

    const validatedData = validationResult.data;
    const newlyCreatedUser = await User.create(validatedData);
    
    if (newlyCreatedUser) {
      revalidatePath(pathToRevalidate);
      return {
        success: true,
        message: "User added successfully"
      };
    }
    
    return {
      success: false,
      message: "Failed to create user"
    };
  } catch (error) {
    console.error("Error in addNewUserAction:", error);
    return {
      success: false,
      message: "Database error occurred",
      error: error.message
    };
  }
}

// Update the editUserAction similarly
export async function editUserAction(currentUserID, formData, pathToRevalidate) {
  console.log("Received form data in editUserAction:", formData);
  
  try {
    await connectToDB();

    const validationResult = await validateData(UserSchema, formData);
    
    if (!validationResult.success) {
      console.log("Validation failed in editUserAction:", validationResult.errors);
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.errors
      };
    }

    const validatedData = validationResult.data;
    
    const updatedUser = await User.findOneAndUpdate(
      { _id: currentUserID },
      validatedData,
      { new: true }
    );

    if (updatedUser) {
      revalidatePath(pathToRevalidate);
      return {
        success: true,
        message: "User updated successfully"
      };
    }
    
    return {
      success: false,
      message: "User not found"
    };
  } catch (error) {
    console.error("Error in editUserAction:", error);
    return {
      success: false,
      message: "Database error occurred",
      error: error.message
    };
  }
}

// Keep other actions the same

// Fetch users action
export async function fetchUsersAction() {
  await connectToDB();
  try {
    const listOfUsers = await User.find({});
    return {
      success: true,
      data: JSON.parse(JSON.stringify(listOfUsers))
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: "Failed to fetch users"
    };
  }
}

// Delete user action
export async function deleteUserAction(currentUserID, pathToRevalidate) {
  await connectToDB();
  
  // Validate ID
  if (!z.string().min(1).safeParse(currentUserID).success) {
    return {
      success: false,
      message: "Invalid user ID"
    };
  }

  try {
    const deletedUser = await User.findByIdAndDelete(currentUserID);

    if (deletedUser) {
      revalidatePath(pathToRevalidate);
      return {
        success: true,
        message: "User deleted successfully"
      };
    }
    
    return {
      success: false,
      message: "User not found"
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: "Database error occurred"
    };
  }
}