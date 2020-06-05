import sequelize from "../models";

export default function resolvers() {
  const models = sequelize.models;

  return {
    RootQuery: {
      user(root, { id }, context) {
        return models.User.findById(id, context);
      },
      users(root, args, context) {
        return models.User.findAll({}, context);
      },
    },

    RootMutation: {
      createUser(root, { input: { email, firstname, lastname } }, context) {
        return models.User.create(
          { email, firstname, lastname },
          { returning: true, context }
        );
      },
      updateUser(root, { id, input: { email, firstname, lastname } }, context) {
        return models.User.update(
          { email, firstname, lastname },
          { where: { id }, context }
        )
          .then(() => {
            return models.User.findById(id, context);
          })
          .catch((e) => {
            throw new Error(e);
          });
      },
      removeUser(root, { id }, context) {
        return models.User.destroy({ where: { id } });
      },
    },

    User: {
      projects(user) {
        return user.getProjects();
      },
    },

    Project: {
      tasks(project) {
        return project.getTasks();
      },
    },
  };
}
