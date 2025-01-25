package com.example.demo.Workplan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/workplan")
public class WorkplanController{
    @Autowired
    private WorkplanService workplanService;

    @PostMapping("/add")
    public String add(@RequestBody WorkplanActivity activity){
        workplanService.addActivity(activity);
        System.out.println(activity.toString());
        return "A new worklan activity is added";
    }

    @GetMapping("/getAll")
    public List<WorkplanActivity> getAll() {
        return workplanService.getAllActivities();
    }

    @GetMapping("/view/{id}")
    public WorkplanActivity view(@PathVariable String id) {
        return workplanService.getActivityById(id);
    }

    @PutMapping("/update/{id}")
    public WorkplanActivity update(@PathVariable String id, @RequestBody WorkplanActivity workplanActivity ) {
        return workplanService.updateActivity(id, workplanActivity);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable String id) {
        return workplanService.deleteActivity(id);
    }
}