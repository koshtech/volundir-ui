import { Coordinator } from './coordinator.js';

export class Validator extends Coordinator {
  constructor(attributes = {}) {
    super();
    Object.assign(this, attributes);
    this.errors = {};
  }

  isValid() {
    console.log('===> Validator#isValid = ', this.constructor.resourceName);
    this.errors = {};

    const validationRules = this.validate();

    if (validationRules.presence) {
      validationRules.presence.forEach(field => {
        if (!this[field] || String(this[field]).trim() === '') {
          this.errors[field] = `O campo ${field} é obrigatório.`;
        }
      });
    }

    if (validationRules.format) {
      for (const field in validationRules.format) {
        const rule = validationRules.format[field];
        if (this[field] && !rule.pattern.test(this[field])) {
          this.errors[field] = rule.message || `O formato do campo ${field} é inválido.`;
        }
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  // static async create(formData) {
  //   if (!formData) {
  //     return { success: false, errors: { general: "no data." } };
  //   }

  //   const values = Object.fromEntries(formData.entries());

  //   let user = new this(values);

  //   if (!user.isValid()) {
  //     console.error("Validation error:", user.errors);
  //     return { success: false, errors: user.errors };
  //   }

  //   try {
  //     await user.save();
  //     return { success: true, user: user };
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     return { success: false, errors: { general: "error." } };
  //   }
  // }

}
