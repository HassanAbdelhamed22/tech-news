export const validateField = (name, value) => {
  switch (name) {
    case "title":
      if (!value.trim()) return "Please enter a title";
      if (value.length < 5) return "Title must be at least 5 characters";
      return "";

    case "category":
      if (!value.trim()) return "Please select a category";
      return "";

    case "subtitle":
      if (!value.trim()) return "Please enter a subtitle";
      return "";

    case "description":
      if (!value.trim()) return "Please enter a description";
      if (value.length < 20)
        return "Description must be at least 20 characters";
      return "";

    case "imageUrl":
      if (!value.trim()) return "Please enter an image URL";
      try {
        new URL(value);
      } catch {
        return "Please enter a valid URL";
      }
      return "";

    case "author":
      if (!value.trim()) return "Please enter an author name";
      return "";

    default:
      return "";
  }
};
