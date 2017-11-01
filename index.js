const store = (function() {
  return {
    employers: [],
    customers: [],
    deliveries: [],
    meals: []
  };
})();

let customerId = 0;
let mealId = 0;
let deliveryId = 0;
let employerId = 0;

class Customer {
  constructor(name, employer) {
    this.id = ++customerId;
    this.name = name;
    if (employer) {
      this.employerId = employer.id;
    }
    store.customers.push(this);
  }

  meals() {
    let mealIds = this.deliveries().map(delivery => {
      return delivery.mealId;
    });
    return mealIds.map(mealId => {
      return store.meals.find(meal => {
        return meal.id === mealId;
      });
    });
  }

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.customerId === this.id;
    });
  }

  totalSpent() {
    return this.meals().reduce((sum, meal) => {
      return sum + meal.price;
    }, 0);
  }
}

class Meal {
  constructor(title, price) {
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
  }

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.mealId === this.id;
    });
  }

  customers() {
    let customerIds = this.deliveries().map(delivery => {
      return delivery.customerId;
    });
    return customerIds.map(customerId => {
      return store.customers.find(customer => {
        return customer.id === customerId;
      });
    });
  }

  static byPrice() {
    return store.meals.sort((a, b) => {
      return b.price - a.price;
    });
  }
}

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId;
    if (meal) {
      this.mealId = meal.id;
    }
    if (customer) {
      this.customerId = customer.id;
    }
    store.deliveries.push(this);
  }

  meal() {
    return store.meals.find(meal => {
      return meal.id === this.mealId;
    });
  }

  customer() {
    return store.customers.find(customer => {
      return customer.id === this.customerId;
    });
  }
}

class Employer {
  constructor(name) {
    this.id = ++employerId;
    this.name = name;
    store.employers.push(this);
  }

  employees() {
    return store.customers.filter(customer => {
      return customer.employerId === this.id;
    });
  }

  deliveries() {
    let nestedDeliveries = this.employees().map(customer => {
      return customer.deliveries();
    });
    return nestedDeliveries.reduce((a, b) => {
      return a.concat(b);
    });
  }

  meals() {
    let nestedMeals = this.employees().map(customer => {
      return customer.meals();
    });
    let flattenedMeals = nestedMeals.reduce((a, b) => {
      return a.concat(b);
    });
    let uniqueMeals = [];
    flattenedMeals.forEach(meal => {
      if (!uniqueMeals.includes(meal)) {
        uniqueMeals.push(meal);
      }
    });
    return uniqueMeals;
  }

  mealTotals() {
    let nestedMeals = this.employees().map(customer => {
      return customer.meals();
    });
    let flattenedMeals = nestedMeals.reduce((a, b) => {
      return a.concat(b);
    });
    let allMeals = {};
    flattenedMeals.forEach(meal => {
      if (Object.keys(allMeals).includes(`${meal.id}`)) {
        allMeals[meal.id] += 1;
      } else {
        allMeals[meal.id] = 1;
      }
    });
    return allMeals;
  }
}
