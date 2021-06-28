<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero__heading">
        Marketing Made For You
      </h1>
    </section>

    <section class="links">
      <div class="links__linkContainer">
        <router-link to="/library" class="links__link">View Our Library</router-link>
        <!-- <router-link to="/discover" class="links__link">Discover What's In</router-link> -->
        <router-link to="/resources" class="links__link">Gain New Resources</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'home-page',
};
</script>
<style lang="scss">
.view {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.home {
  .hero {
    height: 500px;
    background-image: url("~@/assets/images/home/hero_bg.jpg");
    @include breakpoint(tablet-land) {
      margin-top: 4rem;
      background-size: cover;
      background-position: -100px center;
      height: 400px;
    }
    @include breakpoint(mobile) {
      height: 320px;
    }
    &__heading {
      padding: 10rem 12rem 0 0;
      font-size: 6.2rem;
      width: 56rem;
      margin-left: auto;
      font-style: italic;
      font-weight: 700;
      color: #fff;
      text-align: right;
        line-height: 7rem;
      @include breakpoint(desktop) {
        text-align: left;
        margin-left: 13%;
      }
      @include breakpoint(tablet-land) {
        text-align: left;
        font-size: 5rem;
        padding: 6rem 0 0 0;
        margin-left: 10%;
        width: 38rem;
      }
      @include breakpoint(mobile) {
        font-size: 4rem;
        width: 34rem;
        margin-left: 0;
        padding: 6rem 2rem;
      }
      @include breakpoint(mobile-small) {
        width: 100%;
      }
      span {
        font-size: 8rem;
        font-weight: 600;
        font-style: italic;
      }
    }
  }
  .links {
    &__linkContainer {
      display: flex;
      justify-content: center;
      margin: 6rem 0;
      @include breakpoint(mobile) {
        flex-wrap: wrap;
      }
    }
    &__link {
      margin: 0 4rem;
      padding: 2rem 4rem;
      font-weight: 700;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
      text-align: center;
      @include breakpoint(mobile) {
        width: 100%;
        margin-bottom: 3rem;
      }
    }
  }
}
</style>
