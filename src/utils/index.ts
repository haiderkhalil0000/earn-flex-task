export const filterLocation = (data: any) => {
    return data
      ?.map((employee: any, index: number) => {
        const lat = parseFloat(employee.latitude);
        const long = parseFloat(employee.longitude);
        
        // Check if the coordinates are valid
        if (
          !isNaN(lat) &&
          lat >= -90 &&
          lat <= 90 &&
          !isNaN(long) &&
          long >= -180 &&
          long <= 180
        ) {
          return {
            id: employee.Hiring_TestID, // Using Hiring_TestID as id
            position: [lat, long],
            label: employee.city, // Using city as the label
          };
        }
        return null;
      })
      .filter((location) => location !== null);
  };
  