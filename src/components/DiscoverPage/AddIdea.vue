<template>
  <div class="addIdea">
    <div class="input-group">
      <div class="addIdea__heading">
        <img class="avatar" :src="activeUser.avatarUrl" alt />
        <h2>{{ activeUser.firstName }} {{ activeUser.lastName }}</h2>
      </div>
      <textarea v-focus v-model="newIdea.text" cols="40" rows="6"></textarea>
    </div>
    <div class="addIdea__controls">
      <button class="btn btn-blue post" @click="onPostIdea">Post Idea</button>
      <button class="btn btn-red cancel" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
  name: 'AddIdea',
  props: {
    activeUser: Object,
  },
  data() {
    return {
      newIdea: {
        id: null,
        employeeName: `${this.activeUser.firstName} ${this.activeUser.lastName}`,
        employeeAvatar: this.activeUser.avatarUrl,
        datetime: '',
        text: '',
      },
    };
  },

  computed: {
  },
  methods: {
    ...mapActions([
      'addIdea',
    ]),
    onPostIdea(e) {
      const idea = {
        id: Math.round(Math.random() * 1000),
        employeeName: this.newIdea.employeeName,
        employeeAvatar: this.activeUser.avatarUrl,
        text: this.newIdea.text,
        datetime: moment().toISOString(),
        comments: [],
      };
      this.addIdea(idea);
      if (this.$socket) {
        this.$socket.emit('addIdea', idea);
      }
      this.$emit('close');
    },

  },
};
</script>

<style lang="scss" scoped>
.addIdea {
  position: absolute;
  right: 8rem;
  top: 10rem;
  z-index: 99;
  width: 45rem;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
  &__heading {
    display: flex;
    align-items: center;
    h2 {
      margin: 0 1.5rem 0 1rem;
      font-size: 1.6rem;
    }
  }
  .input-group {
    display: flex;
    flex-direction: column;
  }
  textarea {
    font-family: "Nunito Sans", sans-serif;
    font-size: 1em;
    padding: 1rem 0;
    border: none;
    border-bottom: 2px solid $gray;
    outline: none;
    resize: none;
  }
  &__controls {
    display: flex;
    justify-content: flex-end;
    button {
      display: block;
      margin: 2rem 0 0 1rem;
      width: 11rem;
      &.post {
        &:hover {
          color: #fff;
          background-color: $linkBlue;
        }
      }
      &.cancel {
        &:hover {
          color: #fff;
          background-color: $red;
        }
      }
    }
  }
}
</style>
