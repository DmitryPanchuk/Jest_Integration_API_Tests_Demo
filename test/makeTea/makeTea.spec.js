describe("Recipes", () => {
  describe("User story: making tea", () => {
    const { teaBagData } = testData.tea.makeTea;
    const { addSugarData } = testData.tea.makeTea;
    const { addHotWaterData } = testData.tea.makeTea;
    const { removeTeaBagData } = testData.tea.makeTea;
    const { stirData } = testData.tea.makeTea;

    let teaCupId;
    let teaBagId;
    let teaBagFlavour;
    let needToWash;
    let teaItemId;

    describe("Tea associated entities preparation", () => {
      It("Look up teaCups via GET /tea/teaCup/lookUpTeaCups", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Tea associated entities preparation");

        const response = await API.cook.tea.lookUpTeaCups();

        I(() => expect(response.status).toEqual(200));

        if (response.data.cups.find(cup => cup.isClean === true)) {
          teaCupId = cup.id;
        } else {
          teaCupId = Object.keys(response.data.cups)[
            Math.floor(Math.random() * Object.keys(response.data.cups).length)
          ].id;
          needToWash = true;
        }
      });

      It(
        "Wash teaCup if needed via POST /tea/teaCup/{teaCupId}/wash",
        async () => {
          reporter
            .epic("Recipes")
            .feature("Making tea")
            .story("Tea associated entities preparation");

          if (needToWash === true) {
            const response = await API.cook.tea.washTeaCupById(teaCupId);

            I(() => expect(response.status).toEqual(200));
            I(() => expect(response.data.id).toEqual(teaCupId));
            I(() => expect(response.data.isClean).toEqual(true));
          }
        }
      );

      It("Drop water from teaPot via POST /tea/teaPot/drop", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Tea associated entities preparation");

        const response = await API.cook.tea.dropWaterFromTeaPot();

        I(() => expect(response.status).toEqual(200));
        I(() => expect(response.data.cupsLeft).toEqual(0));
      });

      It("Fill teaPot with watervia POST /tea/teaPot/fill", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Tea associated entities preparation");

        const response = await API.cook.tea.fillTeaPot();

        I(() => expect(response.status).toEqual(200));
        I(() => expect(response.data.cupsLeft).toEqual(5));
        I(() => expect(response.data.isHot).toBeFalsy());
      });

      It(
        "Boil water with teaPot via POST /tea/teaPot/boil",
        async () => {
          reporter
            .epic("Recipes")
            .feature("Making tea")
            .story("Tea associated entities preparation");

          const response = await API.houseWare.tea.boilWaterWithTeaPot();

          I(() => expect(response.status).toEqual(200));
          I(() => expect(response.data.cupsLeft).toEqual(5));
          I(() => expect(response.data.isHot).toBeFalsy());
        },
        300000
      );

      It("Look up teaPot via GET /tea/teaPot", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Tea associated entities preparation");

        const response = await API.cook.tea.lookUpTeaPot();

        I(() => expect(response.status).toEqual(200));
        I(() => expect(response.data.cupsLeft).toEqual(5));
        I(() => expect(response.data.isHot).toBeFalsy());
      });
    });

    describe("Regular tea recipe", () => {
      It("Look up teaBags via GET /tea/lookUp/teaBags", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Regular tea recipe");

        const response = await API.cook.tea.lookUpTeaBags();
        I(() => expect(response.status).toEqual(200));

        const teaBag = Object.keys(response.data.teaBags)[
          Math.floor(Math.random() * Object.keys(response.data.teaBags).length)
        ];

        teaBagId = teaBag.id;
        teaBagFlavour = teaBag.flavour;
      });

      It("Upload teaBag via POST /tea/teaItem", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Regular tea recipe");

        const response = await API.cook.tea.uploadTeaBag(
          teaBagData(teaBagId, teaBagFlavour)
        );

        I(() => expect(response.status).toEqual(200));

        teaItemId = response.data.id;
        I(() => expect(response.data.teaItem.id).toEqual(teaItemId));
      });

      It("Look up tea item via GET /tea/teaItem/{teaItemId}", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Regular tea recipe");

        const response = await API.cook.tea.lookUpTeaItem(teaItemId);

        I(() => expect(response.status).toEqual(200));
        I(() => expect(response.data.teaItem.id).toEqual(teaItemId));
        I(() => expect(response.data.teaItem.teaBagId).toEqual(teaBagId));
        I(() => expect(response.data.teaItem.flavour).toEqual(teaItemFlavour));
        I(() => expect(response.data.teaItem.amountLeftInPercent).toEqual(0));
        I(() => expect(response.data.teaItem.amountOfSugar).toEqual(0));
        I(() => expect(response.data.teaItem.isStired).toBeFalsy());
        I(() => expect(response.data.teaItem.isHot).toBeTruthy());
        I(() => expect(response.data.teaItem.teBagRemoved).toBeTruthy());
        I(() => expect(response.data.teaItem.cupId).toEqual(teaCupId));
      });

      It("Fill up teaCup with hot water via PUT /tea/{teaItemId}", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Regular tea recipe");

        const response = await API.cook.tea.modifyTea(
          teaItemId,
          addHotWaterData
        );

        I(() => expect(response.status).toEqual(200));
      });

      It(
        "Remove tea bag from cup via PUT /tea/teaItem/{teaItemId}",
        async () => {
          reporter
            .epic("Recipes")
            .feature("Making tea")
            .story("Regular tea recipe");

          const response = await API.cook.tea.modifyTea(
            teaItemId,
            removeTeaBagData
          );
          I(() => expect(response.status).toEqual(200));
        }
      );

      It("Add sugar via PUT /tea/{teaItemId}", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Regular tea recipe");

        const response = await API.cook.tea.modifyTea(teaItemId, addSugarData);
        I(() => expect(response.status).toEqual(200));
      });

      It("Stir tea in a cup via POST /tea/stir/{teaItemId}", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Regular tea recipe");

        const response = await IAPI.cook.tea.modifyTea(teaItemId, stirData);
        I(() => expect(response.status).toEqual(200));
      });

      It("Look up tea item via GET /tea/teaItem/{teaItemId}", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Regular tea recipe");

        const response = await API.cook.tea.lookUpTeaItem(teaItemId);

        I(() => expect(response.status).toEqual(200));
        I(() => expect(response.data.teaItem.id).toEqual(teaItemId));
        I(() => expect(response.data.teaItem.teaBagId).toEqual(teaBagId));
        I(() => expect(response.data.teaItem.flavour).toEqual(teaItemFlavour));
        I(() => expect(response.data.teaItem.amountLeftInPercent).toEqual(100));
        I(() => expect(response.data.teaItem.amountOfSugar).toEqual(3));
        I(() => expect(response.data.teaItem.isStired).toBeTruthy());
        I(() => expect(response.data.teaItem.isHot).toBeFalsy());
        I(() => expect(response.data.teaItem.teBagRemoved).toBeTruthy());
        I(() => expect(response.data.teaItem.cupId).toEqual(teaCupId));
      });
    });

    describe("Drink tea", () => {
      It(
        "Drink tea via POST /tea/teaItem/{teaItemId}",
        async () => {
          reporter
            .epic("Recipes")
            .feature("Making tea")
            .story("Drink tea");

          const response = await API.cook.tea.drinkTea();
          I(() => expect(response.status).toEqual(200));
          I(() => expect(response.data.teaItem.amountLeftInPercent).toEqual(0));
        },
        300000
      );
    });

    describe("Clean up procedure", () => {
      It("Delete tea item via DELETE /tea/teaItem/{teaItemId}", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Clean up procedure");

        const response = await API.cook.tea.deleteTeaItem(teaItemId);

        I(() => expect(response.status).toEqual(200));

        let errorStatusCode;
        try {
          await API.cook.tea.lookUpTeaItem(teaItemId);
        } catch (e) {
          I(() => expect(e.response.status).toEqual(404));
          errorStatusCode = e.response.status;
        }

        I(() => expect(errorStatusCode).toEqual(404));
      });

      It("Wash teaCup", async () => {
        reporter
          .epic("Recipes")
          .feature("Making tea")
          .story("Clean up procedure");

        const response = await API.houseWare.tea.washTeaCupById(teaCupId);

        I(() => expect(response.status).toEqual(200));
        I(() => expect(response.data.id).toEqual(teaCupId));
        I(() => expect(response.data.isClean).toBeTruthy());
      });
    });
  });
});
