export const customFetch = (
  query: { [x: string]: any },
  xTenantId: string,
  xTenantKey: string
) => {
  return fetch("https://iot.dimensionfour.io/graph", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": xTenantId,
      "x-tenant-key": xTenantKey,
    },
    body: JSON.stringify(query),
  });
};

interface LineData {
  num: number;
}

// My custom reactive Subject. I modeled it to resemble rxjs
export const Subject = <T>(initialValue: T) => {
  const result = {
    next: (num: T) => {
      num;
    },
    value: initialValue,
    subscribe: function (change: (val: T) => void) {
      this.next = (num: T) => {
        this.value = num;
        change(num);
      };
    },
  };

  return result;
};
