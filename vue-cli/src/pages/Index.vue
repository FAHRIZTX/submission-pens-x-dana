<template>
    <div class="container mt-4">
        <div class="card border-primary">
            <div class="card-header text-white bg-primary mb-3">
                <div class="card-title">
                    <h1 class="text-center font-weight-bold">
                        {{ header }}
                    </h1>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mt-3">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>URL Video</label>
                                    <input
                                        type="text"
                                        class="url form-control"
                                        v-model="url"
                                        placeholder="Contoh: https://www.youtube.com/watch?v=okpg-lVWLbE"
                                    />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Kata</label>
                                    <input
                                        type="text"
                                        class="keyword form-control"
                                        v-model="keyword"
                                        placeholder="Contoh: School"
                                    />
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div class="row">
                            <div class="col-md-12">
                                <h2>{{ pagination.meta.title }}</h2>
                            </div>
                            <div class="col-md-12">
                                <img
                                    v-if="pagination.meta.channelLogoUrl"
                                    :src="pagination.meta.channelLogoUrl"
                                    class="rounded-circle"
                                    style="width: 45px"
                                />
                                <a
                                    :href="pagination.meta.channelUrl"
                                    target="_blank"
                                    style="text-decoration: none"
                                    ><h4 class="d-inline ml-2">
                                        {{ pagination.meta.channelName }}
                                    </h4></a
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <table class="table table-striped table-hover">
                            <thead>
                                <th class="text-center">Kata</th>
                                <th class="text-center">Link</th>
                            </thead>
                            <tbody>
                                <td colspan="2" v-if="result.length == 0">
                                    Tidak ditemukan...
                                </td>
                                <tr v-for="(list, i) in result" :key="i">
                                    <td v-html="list.text"></td>
                                    <td class="text-center">
                                        <a
                                            :href="`${url}&t=${list.start}s`"
                                            target="_blank"
                                            >Putar Video
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="col-md-3">
                                <button
                                    class="btn btn-primary text-white btn-block text-dark font-weight-bold"
                                    @click="navigation('first')"
                                    :disabled="!pagination['first']"
                                >
                                    <i class="fas fa-chevron-left"></i>
                                    <i class="fas fa-chevron-left"></i>
                                    Pertama
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button
                                    class="btn btn-primary text-white btn-block text-dark font-weight-bold"
                                    @click="navigation('prev')"
                                    :disabled="!pagination['prev']"
                                >
                                    <i class="fas fa-chevron-left"></i>
                                    Sebelumnya
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button
                                    class="btn btn-primary text-white btn-block text-dark font-weight-bold"
                                    @click="navigation('next')"
                                    :disabled="!pagination['next']"
                                >
                                    Berikutnya
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button
                                    class="btn btn-primary text-white btn-block text-dark font-weight-bold"
                                    @click="navigation('last')"
                                    :disabled="!pagination['last']"
                                >
                                    Terakhir
                                    <i class="fas fa-chevron-right"></i>
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { pDebounce, blockUI } from "./../utils";

export default {
    data() {
        return {
            header: "Mencari Kata didalam Video",
            url: "",
            keyword: "",
            result: [],
            pagination: {
                first: null,
                last: null,
                prev: null,
                next: null,
                meta: {
                    channelLogoUrl: null,
                    title: null,
                    channelName: null,
                    channelUrl: null,
                },
                total: 0,
                page: null,
            },
        };
    },
    watch: {
        keyword: pDebounce(async function handleKeyword(keyword) {
            if (keyword && keyword.length >= 3) {
                await this.cari(keyword, this.url);
            } else {
                this.hapusResult();
            }
        }, 500),
    },
    methods: {
        async cari(keyword, url, pagination) {
            try {
                blockUI(".table");
                const response = await fetch(
                    pagination
                        ? pagination
                        : `https://cari-teks-video-api.vercel.app/api/search?q=${keyword}&url=${encodeURIComponent(
                              url
                          )}`
                ).then((res) => {
                    window.$(".table").unblock();
                    return res.ok ? res.json() : [];
                });

                this.result = response.data;
                Object.keys(response).forEach((key) => {
                    if (key !== "data") {
                        this.pagination[key] = response[key];
                    }
                });
            } catch (error) {}
        },
        async navigation(type) {
            if (!this.pagination[type]) {
                return;
            }
            await this.cari(this.keyword, this.url, this.pagination[type]);
        },
        hapus() {
            this.url = "";
            this.keyword = "";
            this.hapusResult();
        },
        hapusResult() {
            this.result = [];
            this.pagination = {
                first: null,
                last: null,
                prev: null,
                meta: {
                    channelLogoUrl: null,
                    title: null,
                    channelName: null,
                    channelUrl: null,
                },
                next: null,
                total: 0,
                page: null,
            };
        },
    },
};
</script>
