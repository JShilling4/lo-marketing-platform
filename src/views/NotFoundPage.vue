<template>
  <div class="hero error404">
    <div class="cta-block">
      <h1 class="cta-block__heading">
        Uh oh, looks like you got<br class="tp-none" />
        lost on your way home.
      </h1>
      <router-link to="/"><app-button classes="btn btn-orange-fill" text="Back Home"/></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'not-found',
  components: {
    'app-button': () => import('@/components/Shared/AppButton'),
  },
};
</script>

<style lang="scss" scoped>
.hero {
  height: calc(100vh - 136px);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  @include breakpoint(tablet-land) {
    height: 570px;
  }
  @include breakpoint(tablet-port) {
    height: 350px;
  }
  @include breakpoint(mobile) {
    height: 300px;
  }
  &.error404 {
    background-image: url("~@/assets/images/404_hero_bg.jpg");
  }
  .cta-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
    margin: 0 auto;
    &__heading {
      font-size: 4rem;
      color: #fff;
      line-height: 1.5;
      margin-bottom: 3rem;
        font-weight: 800;
      @include breakpoint(tablet-land) {
        font-size: 3.8rem;
      }
    }
    button {
      width: 15rem;
      padding: 1rem 0;
        font-family: 'Nunito Sans', sans-serif;
        font-weight: 700;
    }
  }
}
</style>
