<template>
  <div class="confirmationModal">
    <div class="dialog">
      <p class="message">{{ message }}</p>
      <div class="button-container">
        <app-button classes="btn btn-green" @click.native="$emit('confirmation', true)" text="Yes, I'm Sure" />
        <app-button classes="btn btn-orange" @click.native="$emit('confirmation', false)" text="No, Keep Working" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  components: {
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  props: {
    message: String,
    event: String,
  },
};
</script>

<style lang="scss" scoped>
.confirmationModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  background-color: transparent;
  z-index: 100;
}
.dialog {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem 2rem;
  height: 17rem;
  width: 70rem;
  background-color: #fff;
  box-shadow: 0 1rem 2rem rgba(0,0,0,.3);
  border-radius: 5px;
  @include breakpoint(tablet-land) {
    width: 85%;
  }
  .message {
    text-align: center;
    font-size: 2rem;
    font-weight: 500;
    @include breakpoint(tablet-port) {
      font-size: 1.5rem;
    }
    @include breakpoint(mobile) {
      font-size: 1.25rem;
    }
  }
  .button-container {
    display: flex;
    justify-content: center;
    button {
      min-width: 12rem;
      margin: 0 4rem;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
      @include breakpoint(mobile) {
        min-width: 9rem;
        font-size: 10px;
      }
      @include breakpoint(mobile-small) {
        margin: 0 2rem;
      }
    }
  }
}
</style>
