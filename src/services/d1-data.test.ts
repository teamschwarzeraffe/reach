import { describe, it, expect } from "vitest";
import { generateSelectSql, sortClauseBuilder, whereClauseBuilder } from "./d1-data";
import qs from "qs";

describe("sortClauseBuilder", () => {
  it("should return an empty string if no sort parameters are provided", () => {
    let params = {};
    let result = sortClauseBuilder(params);
    expect(result).toBe("");
  });

  it("should return a valid SQL order by clause for a single sort parameter no array", () => {
    let params = { sort: "name" };
    let result = sortClauseBuilder(params);
    expect(result).toBe("order by name asc");
  });

  it("should return a valid SQL order by clause for a single sort parameter desc no array", () => {
    let params = { sort: "name:desc" };
    let result = sortClauseBuilder(params);
    expect(result).toBe("order by name desc");
  });

  it("should return a valid SQL order by clause for a single sort parameter", () => {
    let params = { sort: ["name:asc"] };
    let result = sortClauseBuilder(params);
    expect(result).toBe("order by name asc");
  });

  it("should return a valid SQL order by clause for multiple sort parameters", () => {
    let params = { sort: ["name:asc", "age:desc"] };
    let result = sortClauseBuilder(params);
    expect(result).toBe("order by name asc, age desc");
  });

  it("should handle sort parameters with different cases", () => {
    let params = { sort: ["Name:ASC", "AGE:desc"] };
    let result = sortClauseBuilder(params);
    expect(result).toBe("order by Name ASC, AGE desc");
  });

  it("should handle sort parameters with spaces", () => {
    let params = { sort: [" name : asc", " age : desc "] };
    let result = sortClauseBuilder(params);
    expect(result).toBe("order by name asc, age desc");
  });
});

describe("generateSelectSql", () => {
  it("should generate SQL with no parameters", () => {
    let table = "users";
    let params = {};
    let result = generateSelectSql(table, params);
    expect(result).toBe("SELECT *, COUNT() OVER() AS total FROM users;");
  });

  it("should generate SQL with id parameter", () => {
    let table = "users";
    let params = { id: "123" };
    let result = generateSelectSql(table, params);
    expect(result).toBe(
      "SELECT *, COUNT() OVER() AS total FROM users WHERE id = '123';"
    );
  });

  it("should generate SQL with limit and offset parameters", () => {
    let table = "users";
    let params = { limit: 10, offset: 5 };
    let result = generateSelectSql(table, params);
    expect(result).toBe(
      "SELECT *, COUNT() OVER() AS total FROM users limit 10 offset 5;"
    );
  });

  it("should generate SQL with sort parameters", () => {
    let table = "users";
    let params = { sort: ["name:asc", "age:desc"] };
    let result = generateSelectSql(table, params);
    expect(result).toBe(
      "SELECT *, COUNT() OVER() AS total FROM users order by name asc, age desc;"
    );
  });

  it("should generate SQL with filters", () => {
    let table = "users";
    let params = { filters: { name: { $eq: "John" }, age: { $gt: 30 } } };
    let result = generateSelectSql(table, params);
    expect(result).toBe(
      "SELECT *, COUNT() OVER() AS total FROM users WHERE name = 'John' AND age > '30';"
    );
  });

  it("should generate SQL with all parameters", () => {
    let table = "users";
    let params = {
      id: "123",
      limit: 10,
      offset: 5,
      sort: ["name:asc", "age:desc"],
      filters: { name: { $eq: "John" }, age: { $gt: 30 } },
    };
    let result = generateSelectSql(table, params);
    expect(result).toBe(
      "SELECT *, COUNT() OVER() AS total FROM users WHERE id = '123';"
    );
  });
});


describe("whereClauseBuilder", () => {
  it("should return an empty string if no filters are provided", () => {
    let filters = {};
    let result = whereClauseBuilder(filters);
    expect(result).toBe("");
  });

  it("should return a valid SQL where clause for a single filter", () => {
    let filters = { name: { $eq: "John" } };
    let result = whereClauseBuilder(filters);
    expect(result).toBe("WHERE name = 'John'");
  });

  it("should return a valid SQL where clause for multiple filters", () => {
    let filters = { name: { $eq: "John" }, age: { $eq: 30 } };
    let result = whereClauseBuilder(filters);
    expect(result).toBe("WHERE name = 'John' AND age = '30'");
  });

  it("should return a valid SQL where clause for filters with array values", () => {
    let filters = { country: { $eq: ["USA", "UK"] } };
    let result = whereClauseBuilder(filters);
    expect(result).toBe("WHERE (country = 'USA' OR country = 'UK')");
  });

  it("should handle filters with different conditions", () => {
    let filters = { name: { $eq: "John" }, age: { $eq: 30 }, country: { $eq: ["USA", "UK"] } };
    let result = whereClauseBuilder(filters);
    expect(result).toBe("WHERE name = 'John' AND age = '30' AND (country = 'USA' OR country = 'UK')");
  });

  it("should return a valid SQL where clause for multiple filters", () => {
      let filters = { name: { $eq: "John" }, age: { $gt: 30 } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE name = 'John' AND age > '30'");
    });

    it("should handle filters with different conditions", () => {
      let filters = { name: { $eq: "John" }, age: { $lt: 30 }, country: { $neq: "USA" } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE name = 'John' AND age < '30' AND country != 'USA'");
    });
  
    it("should handle filters with array values", () => {
      let filters = { country: { $in: ["USA", "UK"] } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE (country = 'USA' OR country = 'UK')");
    });
  
    it("should handle filters with LIKE condition", () => {
      let filters = { name: { $contains: "John" } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE name LIKE '%John%'");
    });
  
    it("should handle filters with greater than condition", () => {
      let filters = { age: { $gt: 30 } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE age > '30'");
    });
  
    it("should handle filters with less than condition", () => {
      let filters = { age: { $lt: 30 } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE age < '30'");
    });
  
    it("should handle filters with IS NULL condition", () => {
      let filters = { name: { $null: true } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE name IS NULL");
    });
  
    it("should handle filters with IS NOT NULL condition", () => {
      let filters = { name: { $nnull: true } };
      let result = whereClauseBuilder(filters);
      expect(result).toBe("WHERE name IS NOT NULL");
    });
});

describe("generateSelectSql via query string", () => {
  it("should generate SQL with no parameters", () => {
    let table = "users";
    let query = "";
    let params = query ? qs.parse(query, { duplicates: "combine" }) : {};
    let result = generateSelectSql(table, params);
    expect(result).toBe("SELECT *, COUNT() OVER() AS total FROM users;");
  });

  it("should generate SQL with filters", () => {
    let table = "users";
    let query = "filters[name][$eq]=John&filters[age][$gt]=30";
    let params = query ? qs.parse(query, { duplicates: "combine" }) : {};
    let result = generateSelectSql(table, params);
    expect(result).toBe(
      "SELECT *, COUNT() OVER() AS total FROM users WHERE name = 'John' AND age > '30';"
    );
  });

  it("should generate SQL with multiple filters of same field", () => {
    let table = "users";
    let query = "filters[name][$starts_with]=John&filters[name][$contains]=Free";
    let params = query ? qs.parse(query, { duplicates: "combine" }) : {};
    let result = generateSelectSql(table, params);
    expect(result).toBe(
      "SELECT *, COUNT() OVER() AS total FROM users WHERE name LIKE 'John%' AND name LIKE '%Free%';"
    );
  });
});