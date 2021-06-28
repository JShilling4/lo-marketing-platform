<template>
    <div class="resources">
        <h1 class="pageHeading">Resources</h1>

        <section class="loResources">
            <h2 class="sectionHeading">Resources for Loan Officers</h2>
            <div class="cardRows">
                <div
                    class="cardContainer"
                    v-for="resource in resources.loResources"
                    :key="resource.id"
                >
                    <resource-card :resource="resource" />
                </div>

                <div class="card-filler"></div>
                <div class="card-filler"></div>
                <div class="card-filler"></div>
            </div>
        </section>

        <section class="loTraining">
            <h2 class="sectionHeading">Loan Officer Training Pieces</h2>
            <div class="cardRows">
                <div
                    class="cardContainer"
                    v-for="resource in resources.loTraining"
                    :key="resource.id"
                >
                    <resource-card :resource="resource" />
                </div>

                <div class="card-filler"></div>
                <div class="card-filler"></div>
                <div class="card-filler"></div>
            </div>
        </section>

        <section class="marketingTeam">
            <h2 class="sectionHeading">The Marketing Team</h2>
            <div class="content">
                <div class="image">
                    <img
                        src="@/assets/images/resources/marketingTeam_2019.jpg"
                        alt="Picture of the Marketing team"
                    />
                </div>

                <div class="copyBlock">
                    <p class="copy">
                        Ruoff’s Marketing Department is comprised of ten highly creative people with over 120
                        years of combined experience in their field. Our motto is “Educate to Empower,” and we
                        take that seriously, whether it’s educating our clients, our loan officers, or your
                        leads. Not only will you have a full team (and the occasional intern!) of marketing
                        professionals by your side to help you navigate the constantly changing world of
                        marketing, but we guarantee you will find someone who can help you with sending
                        high-response emails, crafting engaging social media posts, designing on-brand and
                        unique graphics, creating personalized and co-branded flyers, capturing your best side
                        in photographs and video, and turning your personal website into an automated
                        lead-generating tool. Take proactive control of marketing yourself and the Ruoff brand
                        with a variety of quality marketing materials in our library. With your knowledge of
                        clients and leads and our expertise in crafting the perfect message or media you need,
                        you’ll be generating more leads and closing more deals than ever.
                    </p>
                    <div class="controlBlock">
                        <a
                            href="https://landing.ruoff.com/hubfs/Educate%20to%20Empower%20for%20LOs_8.5x11_Marketing%20Guide.pdf"
                            target="_blank"
                        >
                            <app-button
                                classes="btn btn-orange"
                                text="Meet the Team"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from "vuex";
// components
import ResourceCard from "@/components/Shared/ResourceCard";
import AppButton from "@/components/Shared/AppButton";

export default {
    name: "resources-page",
    components: {
        "resource-card": ResourceCard,
        "app-button": AppButton,
    },
    computed: {
        ...mapState(["resources"]),
    },
};
</script>

<style lang="scss" scoped>
.resources {
    padding: 4rem 4rem 12rem;
    margin: 0 auto;
    max-width: 1464px;
    @include breakpoint(mobile) {
        padding: 4rem 2rem 12rem;
    }
    .pageHeading {
        margin-bottom: 4rem;
        font-weight: 800;
    }
    .sectionHeading {
        color: $teal-light;
        font-weight: 700;
        font-size: 2rem;
        margin-bottom: 2rem;
        @include breakpoint(tablet-land) {
            margin-bottom: 4rem;
        }
    }
}

.marketingTeam {
    margin-top: 4rem;
    .content {
        min-height: 46rem;
        .image {
            margin-right: 2rem;
            float: left;
            @include breakpoint(tablet-land) {
                margin-bottom: 2rem;
            }
            img {
                max-width: 100%;
            }
        }
        .copyBlock {
            .copy {
                line-height: 175%;
                font-weight: 600;
                color: #333;
                font-size: 1.7rem;
            }
            .controlBlock {
                margin-top: 2rem;
                .btn {
                    font-family: 'Nunito Sans', Arial, sans-serif;
                    font-weight: 700;
                }
            }
        }
    }
}

.loResources,
.loTraining {
    clear: left;
    margin-top: 2rem;
    .cardRows {
        display: flex;
        flex-wrap: wrap;
    }
    .cardContainer {
        width: 310px;
        margin: 0 auto;
        @include breakpoint(tablet-port) {
            width: unset;
        }
    }
}
.loTraining {
    margin-top: 0;
}

.card-filler {
    width: 310px;
}
</style>
