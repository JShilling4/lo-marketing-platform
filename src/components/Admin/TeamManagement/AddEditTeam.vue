<template>
    <div class="addEditTeam">
        <h2 class="heading">{{ localItem.id == null ? "Add Team" : `Edit ${localItem.name}` }}</h2>
        <ValidationObserver
            ref="observer"
            v-slot="{ invalid }"
            tag="form"
        >
            <!-- Name -->
            <ValidationProvider
                mode="passive"
                v-slot="{ errors }"
                rules="required"
                class="form-group"
                tag="div"
            >
                <label for="">Name</label>
                <text-input
                    v-focus
                    type="text"
                    name="name"
                    v-model="localItem.name"
                />
                <span class="errorMessage">{{ errors[0] }}</span>
            </ValidationProvider>

            <!-- Team Leader -->
            <ValidationProvider
                mode="passive"
                v-slot="{ errors }"
                rules="required"
                class="form-group"
                tag="div"
            >
                <label for="">Team Leader</label>
                <div class="multiselect-wrapper">
                    <multi-select
                        v-model="localItem.leader"
                        track-by="employeeNumber"
                        label="fullName"
                        placeholder="Select employee"
                        selectLabel=""
                        deselectLabel=""
                        selectedLabel=""
                        :preserve-search="true"
                        :options="users.users"
                    >
                    </multi-select>
                </div>
                <span class="errorMessage">{{ errors[0] }}</span>
            </ValidationProvider>

            <!-- Members -->
            <ValidationProvider
                mode="passive"
                v-slot="{ errors }"
                rules="required"
                class="form-group"
                tag="div"
            >
                <label for="">Members</label>
                <div class="multiselect-wrapper">
                    <multi-select
                        v-model="localItem.members"
                        :multiple="true"
                        track-by="employeeNumber"
                        label="fullName"
                        selectLabel=""
                        deselectLabel=""
                        :close-on-select="false"
                        :preserve-search="true"
                        :options="users.users"
                    >
                        <template
                            slot="selection"
                            slot-scope="{ values, search, isOpen }"
                        >
                            <span
                                class="multiselect__single"
                                v-if="values.length &amp;&amp; !isOpen"
                            >
                                {{ values.length }} selected
                            </span>
                        </template>
                    </multi-select>
                </div>
                <span class="errorMessage">{{ errors[0] }}</span>
            </ValidationProvider>

            <!-- Url -->
            <ValidationProvider
                mode="passive"
                v-slot="{ errors }"
                rules="required"
                class="form-group"
                tag="div"
            >
                <label for="">Url</label>
                <text-input
                    type="text"
                    name="name"
                    v-model="localItem.url"
                />
                <span class="errorMessage">{{ errors[0] }}</span>
            </ValidationProvider>

            <!-- Template -->
            <div class="form-group">
                <label for="">Template</label>
                <div class="multiselect-wrapper">
                    <multi-select
                        v-model="formattedTemplate"
                        track-by="template"
                        label="displayName"
                        placeholder="Select template"
                        selectLabel=""
                        deselectLabel=""
                        selectedLabel=""
                        :preserve-search="true"
                        :options="templateOptions"
                    >
                    </multi-select>
                </div>
            </div>

            <!-- Bio -->
            <div class="form-group">
                <label for="">Bio</label>
                <text-area v-model="localItem.bio" />
            </div>

            <!-- Active -->
            <div class="form-group">
                <label for="">Active</label>
                <div class="input-group">
                    <div class="input-group">
                        <radio-input
                            name="isCatalog"
                            label="Yes"
                            :check="1"
                            id="catalogYes"
                            labelFor="catalogYes"
                            v-model="localItem.isActive"
                        />
                    </div>
                    <div class="input-group">
                        <radio-input
                            name="isCatalog"
                            :check="0"
                            label="No"
                            labelFor="catalogNo"
                            id="catalogNo"
                            v-model="localItem.isActive"
                        />
                    </div>
                </div>
            </div>
        </ValidationObserver>
        <div class="form-controls">
            <span
                @click="saveItem"
                class="control --save"
            >Save</span>
            <span
                @click="close"
                class="control --cancel"
            >Cancel</span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import TextInput from "@/components/Shared/Inputs/TextInput";
import TextArea from "@/components/Shared/Inputs/TextArea";
import RadioInput from "@/components/Shared/Inputs/RadioInput";
import MultiSelect from "vue-multiselect";

export default {
    name: "AddEditTeam",
    props: {
        item: {
            type: Object,
        },
        action: {
            type: String,
        },
    },
    components: {
        "text-input": TextInput,
        "text-area": TextArea,
        "radio-input": RadioInput,
        "multi-select": MultiSelect,
    },
    data() {
        return {
            localItem: { ...this.item },
            templateOptions: [
                {
                    template: "pages/Teams/team-minimal.html.twig",
                    displayName: "Minimal",
                },
                {
                    template: "pages/Teams/team-full.html.twig",
                    displayName: "Full",
                },
            ],
        };
    },
    computed: {
        ...mapState(["users"]),
        formattedTemplate: {
            get() {
                if (this.localItem.template.includes("minimal")) {
                    return {
                        template: "pages/Teams/team-minimal.html.twig",
                        displayName: "Minimal",
                    };
                }
                return {
                    template: "pages/Teams/team-full.html.twig",
                    displayName: "Full",
                };
            },
            set(newValue) {
                this.localItem.template = newValue.template;
            },
        },
    },
    methods: {
        ...mapActions(["manageTeam"]),
        close() {
            this.$emit("close");
        },
        async saveItem() {
            const formValid = await this.$refs.observer.validate();
            if (formValid) {
                const { response, teamIndex } = await this.manageTeam(
                    this.localItem
                );
                if (response.status === 200) {
                    if (teamIndex == -1) {
                        // this.$socket.emit('addTeam', response.data);
                    } else {
                        // this.$socket.emit('editTeam', { team: response.data, teamIndex });
                    }
                }
                this.close();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.addEditTeam {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    padding: 4rem 6rem;
    max-width: 98%;
    max-height: 98%;
    overflow-y: auto;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: $dropdownShadow;
    transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #929292 #fff;
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: $gray-light;
        border-radius: 10px;
        border: 1px solid $gray;
    }
    h2.heading {
        font-weight: 800;
    }
}
form {
    margin-top: 2rem;
}
.inline-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .form-group {
        width: 45%;
    }
    input {
    }
}
label {
    font-weight: 700;
}

.form-controls {
    display: flex;
    justify-content: flex-start;
    margin-top: 2rem;
    .control {
        display: block;
        font-weight: 500;
        margin-right: 1.5rem;
        border-radius: 2rem;
        padding: 0.5rem 2rem 0.25rem;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        &.--save {
            color: $teal-light;
            &:hover {
                background-color: $teal-light;
                color: #fff;
            }
        }
        &.--cancel {
            color: $orange;
            &:hover {
                background-color: $orange;
                color: #fff;
            }
        }
        &.--delete {
            color: $red;
            &:hover {
                background-color: $red;
                color: #fff;
            }
        }
    }
}
</style>
